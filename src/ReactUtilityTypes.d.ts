declare type $ElementProps<T> = T extends React.ComponentType<infer Props>
  ? Props extends Record<string, unknown>
    ? Props
    : never
  : never;
