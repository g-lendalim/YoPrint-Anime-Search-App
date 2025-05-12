import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Pagination,
  InputGroup,
  Badge,
  Spinner,
  FormSelect,
} from "react-bootstrap";
import axios from "axios";
import debounce from "lodash/debounce";

export default function AnimeSearchPage() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

  const fetchAnime = async (searchTerm, pageNumber = 1, itemsPerPage = 25) => {
    console.log("Fetching anime with limit:", itemsPerPage);
    setIsLoading(true);
    try {
      const res = await axios.get("https://api.jikan.moe/v4/anime", {
        params: {
          q: searchTerm,
          page: pageNumber,
          limit: itemsPerPage,
        },
      });
      if (!res.data || !res.data.data || !res.data.pagination) {
        console.error("Unexpected API response:", res.data);
        setAnimeList([]);
        setLastPage(1);
        setTotalResults(0);
        return;
      }
      setAnimeList(res.data.data);
      setLastPage(res.data.pagination.last_visible_page || 1);
      setTotalResults(res.data.pagination.items.total || 0);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setAnimeList([]);
      setLastPage(1);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce((val, page, itemsPerPage) => {
      fetchAnime(val, page, itemsPerPage);
    }, 250),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedFetch(query, page, itemsPerPage);
    } else {
      setAnimeList([]);
    }
  }, [query, page, itemsPerPage, debouncedFetch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > lastPage) return;
    setPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setPage(1);
  };

  const handleCardClick = (id) => {
    navigate(`/anime/${id}`);
  };

  const renderPagination = () => {
    let items = [];

    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={page === 1}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      />
    );

    let startPage, endPage;
    if (lastPage <= 6) {
      startPage = 1;
      endPage = lastPage;
    } else if (page <= 3) {
      startPage = 1;
      endPage = 6;
    } else if (page >= lastPage - 2) {
      startPage = lastPage - 5;
      endPage = lastPage;
    } else {
      startPage = page - 2;
      endPage = page + 3;
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === lastPage}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(lastPage)}
        disabled={page === lastPage}
      />
    );

    return items;
  };

  const uniqueAnimeList = Array.from(
    new Set(animeList.map((a) => a.mal_id))
  ).map((id) => animeList.find((a) => a.mal_id === id));

  const getScoreColor = (score) => {
    if (!score) return "secondary";
    if (score >= 8) return "success";
    if (score >= 6) return "warning";
    return "danger";
  };

  return (
    <Container fluid className="p-5">
      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        <h4 className="mb-3 text-primary">Anime Search</h4>
        <Form>
          <InputGroup>
            <InputGroup.Text className="bg-primary text-white border-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for anime titles..."
              value={query}
              onChange={handleInputChange}
              className="py-2 border-primary"
            />
          </InputGroup>
        </Form>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {query && totalResults === 0 ? (
            <div className="text-center my-5">
              <p className="text-muted">No results found for "{query}"</p>
            </div>
          ) : (
            <>
              {totalResults > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">
                    Found {totalResults} results for "{query}"
                  </span>
                  <div className="d-flex align-items-center">
                    <span className="me-2 text-muted">Items per page:</span>
                    <FormSelect
                      size="sm"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      style={{ width: "80px" }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                    </FormSelect>
                  </div>
                </div>
              )}

              <Row xs={1} sm={2} md={3} xl={4} className="g-3">
                {uniqueAnimeList.map((anime) => (
                  <Col key={anime.mal_id}>
                    <Card
                      className="h-100 shadow-sm border-0 anime-card"
                      onClick={() => handleCardClick(anime.mal_id)}
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                    >
                      <div className="position-relative">
                        <Card.Img
                          variant="top"
                          src={anime.images.jpg.image_url}
                          alt={anime.title}
                          style={{ height: "250px", objectFit: "cover" }}
                          className="rounded-top"
                        />
                        {anime.score && (
                          <Badge
                            bg={getScoreColor(anime.score)}
                            className="position-absolute top-0 end-0 m-2"
                          >
                            {anime.score}
                          </Badge>
                        )}
                        {anime.type && (
                          <Badge
                            bg="dark"
                            className="position-absolute bottom-0 start-0 m-2"
                          >
                            {anime.type}
                          </Badge>
                        )}
                      </div>
                      <Card.Body className="p-3">
                        <Card.Title
                          className="fs-6 text-truncate mb-1"
                          title={anime.title}
                        >
                          {anime.title}
                        </Card.Title>
                        {anime.aired && anime.aired.from && (
                          <Card.Text className="text-muted small mb-0">
                            {new Date(anime.aired.from).getFullYear()}
                            {anime.episodes && ` • ${anime.episodes} episodes`}
                          </Card.Text>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {totalResults > 0 && (
                <div className="d-flex justify-content-center mt-4 mb-2">
                  <Pagination className="mb-0">{renderPagination()}</Pagination>
                </div>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
