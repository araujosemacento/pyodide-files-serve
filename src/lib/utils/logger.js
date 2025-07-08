import { browser } from '$app/environment';
import { dev } from '$app/environment';

/**
 * Sistema de logging que funciona apenas em desenvolvimento
 */
class Logger {
  constructor() {
    this.isDev = dev;
    this.isDevHost = browser && this.checkDevHost();
  }

  checkDevHost() {
    const devHostnames = ['localhost', '127.0.0.1', '0.0.0.0'];
    return devHostnames.includes(window.location.hostname);
  }

  shouldLog() {
    return this.isDev || this.isDevHost;
  }

  /**
   * @param {...any} args
   */
  log(...args) {
    if (this.shouldLog()) {
      console.log(...args);
    }
  }

  /**
   * @param {...any} args
   */
  error(...args) {
    if (this.shouldLog()) {
      console.error(...args);
    }
  }

  /**
   * @param {...any} args
   */
  warn(...args) {
    if (this.shouldLog()) {
      console.warn(...args);
    }
  }

  /**
   * @param {...any} args
   */
  info(...args) {
    if (this.shouldLog()) {
      console.info(...args);
    }
  }

  /**
   * @param {...any} args
   */
  debug(...args) {
    if (this.shouldLog()) {
      console.debug(...args);
    }
  }

  /**
   * @param {...any} args
   */
  group(...args) {
    if (this.shouldLog()) {
      console.group(...args);
    }
  }

  groupEnd() {
    if (this.shouldLog()) {
      console.groupEnd();
    }
  }
}

export const logger = new Logger();
