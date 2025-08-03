import { authenticateJWT } from "../middleware/authenticateJWT";

describe("authenticateJWT", () => {
  it("Debería responder con 403 si no hay header authorization", () => {
    // Arrange
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/test",
      headers: {},
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(res.statusCode).toBe(403);
    expect(res._getJSONData()).toEqual({ message: "No autorizado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("Debería llamar a next si existe header authorization", () => {
    // Arrange
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/test",
      headers: { authorization: "Bearer token" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Act
    authenticateJWT(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res._isEndCalled()).toBe(false); // no respondió directamente
  });
});
