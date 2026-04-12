export const BaseUrlResolver = (
    path: string
) => {
    const base = import.meta.env.BASE_URL || "/";
    return `${base}${path}`;
};

export const BaseUrlNoSlash = (): string => {
  const base = import.meta.env.BASE_URL || "/";

  // убираем все слэши в конце
  return base.replace(/\/+$/, "");
};