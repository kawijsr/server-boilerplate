import { addDays, addHours, addMinutes, addSeconds } from 'date-fns';

export class Utils {
  /**
   * Deep merges two objects
   * @param target The target object to merge into
   * @param source The source object to merge from
   * @returns The merged object
   */
  static merge<T extends object>(target: T, source: Partial<T>): T {
    const output = { ...target };

    if (!Utils.isObject(target) || !Utils.isObject(source)) {
      return source as T;
    }

    Object.keys(source).forEach((key) => {
      if (Utils.isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = Utils.merge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });

    return output;
  }

  private static isObject(item: unknown): item is Record<string, any> {
    return Boolean(item && typeof item === 'object' && !Array.isArray(item));
  }

  static convertToCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  static convertToSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (match) => `_${match}`).toLowerCase();
  }

  static dateAdd(date: Date, time: string): Date {
    const regex = /(\d+)([dhms])/g;
    const [, valueStr, unit] = time.split(regex);
    const value = parseInt(valueStr, 10);
    switch (unit) {
      case 'd':
        return addDays(date, value);
      case 'h':
        return addHours(date, value);
      case 'm':
        return addMinutes(date, value);
      case 's':
        return addSeconds(date, value);
      default:
        return date;
    }
  }
}
