import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("../pages/Dashboard/StatCard", () => ({
    default: ({ type, title, value, icon, color }) => (
        <div data-testid="stat-card">
            <p>{title}</p>
            <p>{value}</p>
        </div>
    ),
}));

vi.mock("react-spinners", () => ({
    GridLoader: () => <div data-testid="grid-loader">Loading...</div>,
}));

describe("Dashboard Component", () => {


    it("renders stats after loading", async () => {
        render(
            <Router>
                <Dashboard refresh={false} />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getAllByTestId("stat-card")).toHaveLength(3);
        });

        expect(screen.getByText("Credentials")).toBeInTheDocument();
        expect(screen.getByText("Issuers")).toBeInTheDocument();
        expect(screen.getByText("Verifications")).toBeInTheDocument();

    });


});