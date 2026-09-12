/**
 * Matches Spring Data's org.springframework.data.web.PagedModel (Spring Boot 3.3+),
 * the shape ad-service returns from GET /api/v1/animals.
 */
export interface PagedResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
