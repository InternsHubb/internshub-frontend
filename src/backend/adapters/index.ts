/**
 * Adapter utilities for mapping future backend DTOs to feature UI view models.
 *
 * Keeping DTO-to-UI mapping in adapters protects feature components from backend
 * schema changes and keeps presentation components cleanly decoupled from API shapes.
 */
export type DtoAdapter<TDto, TModel> = (dto: TDto) => TModel;

export function adaptList<TDto, TModel>(
  items: ReadonlyArray<TDto>,
  adapter: DtoAdapter<TDto, TModel>
): TModel[] {
  return items.map(adapter);
}
