import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Header from "../Header";

test('renders Header', () => {
    render(<BrowserRouter>
        <Header />
    </BrowserRouter>)

    // screen.debug();
    const signInLink = screen.getByRole('link', {name: 'Sign in'});
    expect(signInLink).toBeInTheDocument();
    const signUpLink = screen.getByRole('link', {name: 'Sign up'});
    expect(signUpLink).toBeInTheDocument();
});
