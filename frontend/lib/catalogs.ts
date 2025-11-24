import type { IArticulo, IResponsable, ISede, IUbicacion } from '@/types';
import { sortCatalogByLabel } from '@/lib/api/helpers';

export const formatSedeLabel = (sede: ISede) => {
  const code = sede.codigo ? `(${sede.codigo})` : '';
  return `${sede.nombre} ${code}`.trim();
};

export const formatArticuloLabel = (articulo: IArticulo) => {
  const code = articulo.codigo ? `(${articulo.codigo})` : '';
  return `${articulo.nombre} ${code}`.trim();
};

export const formatResponsableLabel = (responsable: IResponsable) => {
  const sedeNombre =
    responsable.sede_nombre ||
    (typeof responsable.sede === 'object' && responsable.sede ? responsable.sede.nombre : '');
  const cargo = responsable.cargo ? `• ${responsable.cargo}` : '';
  const sede = sedeNombre ? `— ${sedeNombre}` : '';
  return `${responsable.nombre_completo} ${cargo} ${sede}`.trim();
};

export const formatUbicacionLabel = (ubicacion: IUbicacion) => {
  const sedeNombre =
    ubicacion.sede_nombre ||
    (typeof ubicacion.sede === 'object' && ubicacion.sede ? ubicacion.sede.nombre : '');
  const code = ubicacion.codigo ? `${ubicacion.codigo} · ` : '';
  const sede = sedeNombre ? `— ${sedeNombre}` : '';
  return `${code}${ubicacion.nombre} ${sede}`.trim();
};

export const sortSedes = (sedes: ISede[] = []) =>
  sortCatalogByLabel(sedes, (sede) => formatSedeLabel(sede));

export const sortArticulos = (articulos: IArticulo[] = []) =>
  sortCatalogByLabel(articulos, (articulo) => formatArticuloLabel(articulo));

export const sortResponsables = (responsables: IResponsable[] = []) =>
  sortCatalogByLabel(responsables, (responsable) => formatResponsableLabel(responsable));

export const sortUbicaciones = (ubicaciones: IUbicacion[] = []) =>
  sortCatalogByLabel(ubicaciones, (ubicacion) => formatUbicacionLabel(ubicacion));

