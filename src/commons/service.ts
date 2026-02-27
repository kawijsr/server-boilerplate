type Constructor<T> = Function & { prototype: T };

export abstract class Service {
  private static instances = new Map<Function, any>();

  protected constructor() {}

  public static getInstance<T extends Service>(this: Constructor<T>): T {
    const ClassConstructor = this as any;

    if (!Service.instances.has(ClassConstructor)) {
      Service.instances.set(ClassConstructor, new ClassConstructor());
    }

    return Service.instances.get(ClassConstructor);
  }
}