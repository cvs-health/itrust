import React from "react";
import { render, screen } from "@testing-library/react";
import MyDAS from "../pages/Das/MyDAS";
import { useAuthContext } from "../context/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { findDASById } from "../services/DASService";


vi.mock("@mui/styles", () => ({
    makeStyles: () => () => ({}),
    withStyles: (component) => component,
  }));

vi.mock("../context/AuthContext", () => ({
    useAuthContext: vi.fn(),
}));

vi.mock("../services/CodelistService", () => ({
    findCodelistByName: vi.fn(),
}))

vi.mock("react-router-dom", () => ({
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
    useParams: vi.fn(),
}));

vi.mock("../services/DASService", () => ({
    findDASById: vi.fn(),
}));


  
describe("MyDAS Component", () => {
    beforeEach(() => {
        useAuthContext.mockReturnValue({
            user: { dasId: "123" },
            permissions: [],
        });
        useLocation.mockReturnValue({ state: {} });
        useNavigate.mockReturnValue(vi.fn());
        useParams.mockReturnValue({ id: "123" });
        findDASById.mockResolvedValue(null);
    });

    it("should render the title 'My DAS'", async () => {
        render(<MyDAS />);
        const title = await screen.findByText("My DAS");
        expect(title).toBeInTheDocument();
    });
});