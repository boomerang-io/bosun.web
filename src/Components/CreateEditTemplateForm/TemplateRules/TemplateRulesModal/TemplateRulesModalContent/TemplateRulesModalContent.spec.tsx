import React from "react";
import Inputs from ".";
import { fireEvent, waitFor } from "@testing-library/react";

const mockfn = jest.fn();

const props = {
  isEdit: true,
  input: {
    defaultValue: "dogs",
    description: "Tim property",
    key: "tim.property",
    label: "Tim Property",
    required: false,
    type: "text",
  },
  loading: false,
  updateInputs: mockfn,
  closeModal: mockfn,
  inputsName: [],
  workflowActions: { updateWorkflowInput: mockfn, createWorkflowInput: mockfn },
};

describe("Inputs --- Snapshot Test", () => {
  it("Capturing Snapshot of Inputs", () => {
    const { baseElement } = rtlRender(<Inputs {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});

describe("Inputs --- RTL", () => {
  it("Change default value by type correctly", () => {
    const { getByText, getByPlaceholderText, queryByTestId } = rtlRender(<Inputs {...props} />);
    expect(queryByTestId("text-input")).toBeInTheDocument();

    const typeSelect = getByPlaceholderText(/select an item/i);

    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/text area/i));

    expect(queryByTestId("toggle")).not.toBeInTheDocument();
    expect(queryByTestId("text-area")).toBeInTheDocument();

    fireEvent.click(typeSelect);
    fireEvent.click(getByText(/select/i));

    expect(queryByTestId("text-area")).not.toBeInTheDocument();
    expect(queryByTestId("select")).toBeInTheDocument();
  });

  it("Shouldn't save property without key and label", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = rtlRender(
      <Inputs {...props} isEdit={false} input={undefined} />
    );
    fireEvent.click(getByText(/create/i));
    await waitFor(() => expect(getByTestId("inputs-modal-confirm-button")).toBeDisabled());

    const keyInput = getByPlaceholderText("key.value");
    const labelInput = getByPlaceholderText(/name/i);

    fireEvent.change(keyInput, { target: { value: "test" } });
    fireEvent.change(labelInput, { target: { value: "test" } });

    await waitFor(() => expect(getByTestId("inputs-modal-confirm-button")).toBeEnabled());
  });
});
