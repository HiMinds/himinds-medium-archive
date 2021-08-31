/*
 *
 *  Credits to coniferconifer, https://github.com/coniferconifer
 * https://github.com/coniferconifer/co2sensor/blob/master/ESP32-MH-Z14A-raw.ino
 */

#include <stdio.h>

#include "mgos.h"
#include "mgos_app.h"
#include "mgos_gpio.h"
#include "mgos_timers.h"
#include "mgos_uart.h"

#define UART_NO 1

int co2_global = 0;

int get_co2_value(void){
  return co2_global;
}



static void timer_cb(void *arg)
{
  // Command for reading Co2
  uint8_t command[] = {0xFF, 0x01, 0x86, 0x00, 0x00, 0x00, 0x00, 0x00, 0x79};

  mgos_uart_write(UART_NO, command, sizeof(command));

  (void)arg;
}

/*
 * Dispatcher can be invoked with any amount of data (even none at all) and
 * at any time. Here we demonstrate how to process input line by line.
 */
static void uart_dispatcher(int uart_no, void *arg)
{
  static struct mbuf lb = {0};
  int i;
  uint8_t checksum = 0;

  assert(uart_no == UART_NO);
  size_t rx_av = mgos_uart_read_avail(uart_no);
  if (rx_av == 0)
    return;
  mgos_uart_read_mbuf(uart_no, &lb, rx_av);

  if ((lb.buf[0] == 0xFF) && (lb.buf[1] == 0x86))
  {
    for (i = 1; i < 8; i++)
    {
      checksum += lb.buf[i];
    }
    checksum = 0xff - checksum;
    checksum += 1;

    if (lb.buf[8] != checksum)
    {
      LOG(LL_INFO, ("checksum error"));
      return;
    }

    uint16_t co2 = 0;
    co2 = (uint16_t)lb.buf[2] << 8;
    co2 += lb.buf[3];

    co2_global = (int)co2;

    //LOG(LL_INFO, ("CO2 '%u' ppm", co2));
  }
  /* remove the data from the buffer. */
  mbuf_remove(&lb, lb.len);
  (void)arg;
}

enum mgos_app_init_result mgos_app_init(void)
{
  struct mgos_uart_config ucfg;
  mgos_uart_config_set_defaults(UART_NO, &ucfg);
  /*
   * At this point it is possible to adjust baud rate, pins and other settings.
   * 115200 8-N-1 is the default mode, but we set it anyway
   */
  ucfg.baud_rate = 9600;
  ucfg.num_data_bits = 8;
  ucfg.parity = MGOS_UART_PARITY_NONE;
  ucfg.stop_bits = MGOS_UART_STOP_BITS_1;
  
  if (!mgos_uart_configure(UART_NO, &ucfg))
  {
    return MGOS_APP_INIT_ERROR;
  }

  mgos_set_timer(10000 /* ms */, true /* repeat */, timer_cb, NULL /* arg */);

  mgos_uart_set_dispatcher(UART_NO, uart_dispatcher, NULL /* arg */);
  mgos_uart_set_rx_enabled(UART_NO, true);

  LOG(LL_INFO,("Test code for  MH-Z14A CO2 level monitor"));

  return MGOS_APP_INIT_SUCCESS;
}
