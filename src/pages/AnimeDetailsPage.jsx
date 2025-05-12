import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Image,
  Card,
  Spinner,
} from "react-bootstrap";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        setAnime(res.data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch anime details:", err);
        setError("Failed to load anime details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted">Loading anime details...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <Button as={Link} to="/" variant="primary" className="mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Search
        </Button>
      </Container>
    );
  }

  if (!anime) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-warning">No anime data found</div>
        <Button as={Link} to="/" variant="primary" className="mt-3">
          <i className="bi bi-arrow-left me-2"></i>Back to Search
        </Button>
      </Container>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #f5f7fa, #e4e9f2)",
        minHeight: "100vh",
        paddingBottom: "2rem",
      }}
    >
      <Container className="py-5">
        <Card className="border-0 shadow-sm overflow-hidden">
          <Card.Body className="p-0">
            <Row className="g-0">
              <Col md={4} lg={3} className="position-relative">
                <div className="h-100" style={{ background: "#f0f2f5" }}>
                  <Image
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />            
                  <div
                    className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                    }}
                  >
                    <div className="d-flex gap-2">
                      {anime.genres?.slice(0, 3).map((genre) => (
                        <span
                          key={genre.mal_id}
                          className="badge bg-primary rounded-pill"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={8} lg={9}>
                <div className="p-4">
                  <h1 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
                    {anime.title}
                  </h1>
                  {anime.title_english &&
                    anime.title_english !== anime.title && (
                      <h6 className="text-muted mb-3">{anime.title_english}</h6>
                    )}

                  <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                    {anime.status && (
                      <span className="badge bg-success">{anime.status}</span>
                    )}
                    {anime.rating && (
                      <span className="badge bg-warning text-dark">
                        {anime.rating}
                      </span>
                    )}
                    {anime.season && (
                      <span className="badge bg-info text-dark">
                        {anime.season.charAt(0).toUpperCase() +
                          anime.season.slice(1)}{" "}
                        {anime.year}
                      </span>
                    )}
                    {anime.episodes && (
                      <span className="badge bg-primary">
                        {anime.episodes} Episodes
                      </span>
                    )}
                  </div>

                  <p
                    className="mb-4"
                  >
                    {anime.synopsis}
                  </p>

                  <Row className="g-3">
                    <Col xs={6} md={5} xl={3}>
                      <Card
                        className="text-center h-100 border-0 shadow-sm"
                        style={{ borderRadius: "10px", background: "#fcf0e6" }}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center py-3">
                          <div className="d-flex align-items-center justify-content-center">
                            <i
                              className="bi bi-star fs-3 me-3"
                              style={{ color: "#e67e22" }}
                            ></i>
                            <div>
                              <div
                                className="fw-bold fs-4"
                                style={{ color: "#e67e22" }}
                              >
                                {anime.score || "N/A"}
                              </div>
                              <div style={{ color: "#e67e22" }}>
                                {anime.favorites?.toLocaleString() || "N/A"}{" "}
                                USERS
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col xs={6} md={5} xl={3}>
                      <Card
                        className="text-center h-100 border-0 shadow-sm"
                        style={{ borderRadius: "10px", background: "#ebf9f7" }}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center py-3">
                          <div className="d-flex align-items-center justify-content-center">
                            <i
                              className="bi bi-trophy fs-3 me-3"
                              style={{ color: "#1abc9c" }}
                            ></i>
                            <div>
                              <div
                                className="fw-bold fs-4"
                                style={{ color: "#1abc9c" }}
                              >
                                #{anime.rank || "N/A"}
                              </div>
                              <div style={{ color: "#1abc9c" }}>RANKED</div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col xs={6} md={5} xl={3}>
                      <Card
                        className="text-center h-100 border-0 shadow-sm"
                        style={{ borderRadius: "10px", background: "#edf0fa" }}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center py-3">
                          <div className="d-flex align-items-center justify-content-center">
                            <i
                              className="bi bi-heart fs-3 me-3"
                              style={{ color: "#8e44ad" }}
                            ></i>
                            <div>
                              <div
                                className="fw-bold fs-4"
                                style={{ color: "#9b59b6" }}
                              >
                                #{anime.popularity || "N/A"}
                              </div>
                              <div style={{ color: "#9b59b6" }}>POPULARITY</div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col xs={6} md={5} xl={3}>
                      <Card
                        className="text-center border-0 shadow-sm"
                        style={{ borderRadius: "10px", background: "#eef6fc" }}
                      >
                        <Card.Body className="d-flex flex-column justify-content-center py-3">
                          <div className="d-flex align-items-center justify-content-center">
                            <i
                              className="bi bi-people fs-3 me-3"
                              style={{ color: "#2980b9" }}
                            ></i>
                            <div>
                              <div
                                className="fw-bold fs-4"
                                style={{ color: "#2980b9" }}
                              >
                                {anime.members?.toLocaleString() || "N/A"}
                              </div>
                              <div style={{ color: "#2980b9" }}>MEMBERS</div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {anime.trailer?.embed_url && (
          <Card className="mt-5 border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Trailer</h4>
              <div className="ratio ratio-16x9">
                <iframe
                  src={anime.trailer.embed_url}
                  title={`${anime.title} Trailer`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </Card.Body>
          </Card>
        )}

        <Button
          as={Link}
          to="/"
          variant="outline-primary"
          className="mt-3"
          style={{
            borderRadius: "50px",
            transition: "0.3s ease",
          }}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Search
        </Button>
      </Container>
    </div>
  );
}
