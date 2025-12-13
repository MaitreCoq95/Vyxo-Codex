/**
 * Vyxo Codex 2.0 - Structured Logger
 * Logger centralisé avec différents niveaux et contexte
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogContext {
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private serviceName: string;
  private environment: string;

  constructor(serviceName: string = 'vyxo-codex') {
    this.serviceName = serviceName;
    this.environment = process.env.NODE_ENV || 'development';
  }

  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context) {
      entry.context = {
        ...context,
        service: this.serviceName,
        environment: this.environment,
      };
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return entry;
  }

  private output(entry: LogEntry) {
    const formatted = JSON.stringify(entry);

    switch (entry.level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
      case 'fatal':
        console.error(formatted);
        break;
    }

    // En production, envoyer à un service externe
    if (this.environment === 'production') {
      this.sendToExternalService(entry);
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    // TODO: Implémenter l'envoi à Datadog, Sentry, etc.
    // Example avec fetch:
    // try {
    //   await fetch(process.env.LOG_ENDPOINT!, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(entry),
    //   });
    // } catch (err) {
    //   // Fail silently en production
    // }
  }

  debug(message: string, context?: LogContext) {
    this.output(this.formatLog('debug', message, context));
  }

  info(message: string, context?: LogContext) {
    this.output(this.formatLog('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    this.output(this.formatLog('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.output(this.formatLog('error', message, context, error));
  }

  fatal(message: string, error?: Error, context?: LogContext) {
    this.output(this.formatLog('fatal', message, context, error));
  }

  // Helpers spécifiques
  apiRequest(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    this.info(`${method} ${path} ${statusCode}`, {
      ...context,
      type: 'api_request',
      method,
      path,
      statusCode,
      duration,
    });
  }

  apiError(method: string, path: string, error: Error, context?: LogContext) {
    this.error(`${method} ${path} failed`, error, {
      ...context,
      type: 'api_error',
      method,
      path,
    });
  }

  databaseQuery(query: string, duration: number, context?: LogContext) {
    this.debug('Database query executed', {
      ...context,
      type: 'database_query',
      query,
      duration,
    });
  }

  securityEvent(eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext) {
    this.warn(`Security event: ${eventType}`, {
      ...context,
      type: 'security_event',
      eventType,
      severity,
    });
  }

  businessMetric(metric: string, value: number, context?: LogContext) {
    this.info(`Metric: ${metric}`, {
      ...context,
      type: 'business_metric',
      metric,
      value,
    });
  }
}

// Instance globale
export const logger = new Logger();

// Export de la classe pour créer des loggers personnalisés
export { Logger };
