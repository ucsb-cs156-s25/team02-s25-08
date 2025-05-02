import React from "react";
import UCSBDiningComonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningComonsMenuItemForm";
import { ucsbDiningComonsMenuItemFixtures } from "fixtures/ucsbDiningComonsMenuItemFixtures";

export default {
  title: "components/UCSBDiningCommonsMenuItem/UCSBDiningComonsMenuItemForm",
  component: UCSBDiningComonsMenuItemForm,
};

const Template = (args) => {
  return <UCSBDiningComonsMenuItemForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: ucsbDiningComonsMenuItemFixtures.oneDiningCommonsMenuItem,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
