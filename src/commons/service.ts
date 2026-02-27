export abstract class Service {
  private static instances = new Map<string, any>();

  protected constructor() {}

  public static getInstance<T extends Service>(c: { new (): T}): T {
    const instanceName = c.name;

    if (!Service.instances.has(instanceName)) {
      Service.instances.set(instanceName, new c());
    }

    return Service.instances.get(instanceName);
  }
}