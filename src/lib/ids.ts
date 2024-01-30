/* eslint-disable node/no-unsupported-features/es-syntax */
function hasProperty<X extends Record<string, never>, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return prop in obj;
}

function mapId<T extends Record<string, never>>(args: T): Record<string, never> {
  if (hasProperty(args, 'id')) {
    const { id, ...withoutIdArgs } = args;

    return {
      ...withoutIdArgs,
      _id: id,
    };
  }

  return args;
}

export { mapId };
