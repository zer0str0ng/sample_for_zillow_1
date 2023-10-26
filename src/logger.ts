import { ConsoleLogger } from '@nestjs/common';

const PREFIX_STACK_LINE = 4;
const PREFIX_STACK_INDEX = 2;

export class ILogger extends ConsoleLogger {
  error(message: string, stack?: string, context?: string) {
    super.error(this.getPrefix() + message);
  }

  info(message: string, stack?: string, context?: string) {
    super.log(this.getPrefix() + message);
  }

  log(message: string, stack?: string, context?: string) {
    super.log(this.getPrefix() + message);
  }

  warn(message: string, stack?: string, context?: string) {
    super.warn(this.getPrefix() + message);
  }

  // Helper method to extra Class Name and Method from stack trace
  private getPrefix() {
    return '- ' + new Error().stack?.split(/\r\n|\r|\n/g)[PREFIX_STACK_LINE].split(/\s+/)[PREFIX_STACK_INDEX] + ': ';
  }
}
