import React from "react";
import Inputs from ".";
import { fireEvent } from "@testing-library/react";

(global as any).body = { createTextRange: jest.fn() };
const mockfn = jest.fn();
const props = {
    navigateBack: mockfn,
    onSubmit: mockfn,
    onCancel: mockfn,
    template: {
        id: "5cd49777f6ea74a9bb6ac629",
        key: "static_code_analysis",
        createDate: "2019-06-21T00:00:00.000+0000",
        name: "Static Code Analysis",
        description: "The following policy metrics are validated from SonarQube data collected in your CI pipeline.",
        order: 0,
        rego: "",
        labels: ["test", "this"],
        rules: [
            {
                "id":"1",
                "key": "value",
                "label": "Testing",
                "type": "text",
                "defaultValue": "",
                "required": false,
                "description": "",
                "options": null
            }
        ]
    },
    type: "create",
    validationData: {
        templateNames: [],
        templateKeys: [],
    }
};
beforeEach(() => {
    document.body.setAttribute("id", "app");
});
describe("Inputs --- Snapshot Test", () => {
    it("Capturing Snapshot of Inputs", () => {
        const { baseElement } = rtlRender(<Inputs {...props}/>);
        expect(baseElement).toMatchSnapshot();
    });
});
describe("Inputs --- RTL", () => {
    it("Render inputs correctly", () => {
        const { queryByText } = rtlRender(<Inputs {...props}/>);
        expect(queryByText("Testing")).toBeInTheDocument();
    });
    it("Opens create new property modal", () => {
        const { queryByText, getByTestId } = rtlRender(<Inputs {...props}/>);
        //expect(queryByText(/Create a new property/i)).not.toBeInTheDocument();
        //const modalTrigger = getByText(/Create a new property/i);
        const modalTrigger = getByTestId("create-new-workflow-input-button");
        fireEvent.click(modalTrigger);
        expect(queryByText(/Create a new rule/i)).toBeInTheDocument();
    });
    it("Opens edit property modal", () => {
        const { getByTestId, queryByText } = rtlRender(<Inputs {...props}/>);
        //expect(queryByText(/Let's update it/i)).not.toBeInTheDocument();
        const modalTrigger = getByTestId("edit-property-trigger");
        fireEvent.click(modalTrigger);
        expect(queryByText(/Let's update it/i)).toBeInTheDocument();
    });
});
