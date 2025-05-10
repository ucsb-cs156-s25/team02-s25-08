import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecommendationRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
  validateEmails = true,
}) {
  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  const email_regex = /\S+@\S+\.\S+/;
  // Stryker restore Regex

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });

  const navigate = useNavigate();

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">ID</Form.Label>
              <Form.Control
                data-testid="RecommendationRequestForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-requesterEmail"
              id="requesterEmail"
              type="email"
              isInvalid={Boolean(errors.requesterEmail)}
              {...register("requesterEmail", {
                required: "Requester email is required.",
                ...(validateEmails
                  ? {
                      pattern: {
                        value: email_regex,
                        message: "Must be a valid email address.",
                      },
                    }
                  : {}),
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.requesterEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="professorEmail">Professor Email</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-professorEmail"
              id="professorEmail"
              type="email"
              isInvalid={Boolean(errors.professorEmail)}
              {...register("professorEmail", {
                required: "Professor email is required.",
                ...(validateEmails
                  ? {
                      pattern: {
                        value: email_regex,
                        message: "Must be a valid email address.",
                      },
                    }
                  : {}),
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.professorEmail?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="explanation">Explanation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              data-testid="RecommendationRequestForm-explanation"
              id="explanation"
              isInvalid={Boolean(errors.explanation)}
              {...register("explanation", {
                required: "Explanation is required.",
                maxLength: {
                  value: 255,
                  message: "Explanation cannot exceed 255 characters.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.explanation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateRequested">
              Date Requested (in UTC)
            </Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-dateRequested"
              id="dateRequested"
              type="text"
              isInvalid={Boolean(errors.dateRequested)}
              {...register("dateRequested", {
                required: "Date requested is required.",
                pattern: {
                  value: isodate_regex,
                  message: "Must be in ISO datetime format.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateRequested?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={5}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateNeeded">Date Needed (in UTC)</Form.Label>
            <Form.Control
              data-testid="RecommendationRequestForm-dateNeeded"
              id="dateNeeded"
              type="text"
              isInvalid={Boolean(errors.dateNeeded)}
              {...register("dateNeeded", {
                required: "Date needed is required.",
                pattern: {
                  value: isodate_regex,
                  message: "Must be in ISO datetime format.",
                },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateNeeded?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={2} className="d-flex align-items-center">
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="done"
              label="Done? (if checked, job will be marked as done)"
              data-testid="RecommendationRequestForm-done"
              // Stryker disable next-line all
              defaultChecked={initialContents?.done || false}
              // Stryker restore next-line all
              {...register("done")}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            type="submit"
            data-testid="RecommendationRequestForm-submit"
            className="me-2"
          >
            {buttonLabel}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            data-testid="RecommendationRequestForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default RecommendationRequestForm;
