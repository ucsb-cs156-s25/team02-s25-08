import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams, Navigate } from "react-router-dom";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: org,
    _error,
    _status,
  } = useBackend([`/api/ucsborganizations?id=${id}`], {
    method: "GET",
    url: "/api/ucsborganizations",
    params: { id },
  });

  const objectToAxiosPutParams = (org) => ({
    url: "/api/ucsborganizations",
    method: "PUT",
    params: { id: org.id },
    data: {
      orgCode: org.orgCode,
      orgTranslationShort: org.orgTranslationShort,
      orgTranslation: org.orgTranslation,
      inactive: org.inactive,
    },
  });

  const onSuccess = (org) => {
    toast(`Organization Updated - id: ${org.id} orgCode: ${org.orgCode}`);
  };

  const mutation = useBackendMutation(objectToAxiosPutParams, { onSuccess }, [
    `/api/ucsborganizations?id=${id}`,
  ]);

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Organization</h1>
        {org && (
          <UCSBOrganizationsForm
            submitAction={onSubmit}
            buttonLabel="Update"
            initialContents={org}
          />
        )}
      </div>
    </BasicLayout>
  );
}
