import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationsForm from "main/components/UCSBOrganizations/UCSBOrganizationsForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsCreatePage({ storybook = false }) {
  const objectToAxiosParams = (org) => ({
    url: "/api/ucsborganizations/post",
    method: "POST",
    params: {
      orgCode: org.orgCode,
      orgTranslationShort: org.orgTranslationShort,
      orgTranslation: org.orgTranslation,
      inactive: org.inactive,
    },
  });

  const onSuccess = (org) => {
    toast(
      `New UCSB Organization Created — orgCode: ${org.orgCode} orgTranslationShort: ${org.orgTranslationShort}`
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    ["/api/ucsborganizations/all"]
  );

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
        <h1>Create New UCSB Organization</h1>
        <UCSBOrganizationsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
