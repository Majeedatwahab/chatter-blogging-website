import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import SignIn from "@/app/login/page";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from '@/Services/AuthService';

// Mock the necessary modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/Services/AuthService', () => ({
  signInWithEmail: jest.fn(),
  signInWithGoogle: jest.fn(),
}));

const mockedRouterPush = jest.fn();

describe("SignIn Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockedRouterPush,
    });
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<SignIn />);
    expect(screen.getByTestId('sign-in-heading')).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("handles sign-in with email", async () => {
    (signInWithEmail as jest.Mock).mockResolvedValue({});

    render(<SignIn />);

    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "password123" },
    }); 
    fireEvent.click(screen.getByTestId('email-sign-in-button'));

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockedRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("remembers user credentials when 'Remember Me' is checked", async () => {
    render(<SignIn />);

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByTestId('remember-me-checkbox'));
    fireEvent.click(screen.getByTestId('email-sign-in-button'));

    await waitFor(() => {
      expect(localStorage.getItem("userEmail")).toBe("test@example.com");
      expect(localStorage.getItem("userPassword")).toBe("password123");
    });
  });

  it("toggles password visibility", () => {
    render(<SignIn />);

    const passwordInput = screen.getByTestId("password-input");
    const toggleButton = screen.getByLabelText("Toggle password visibility");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("displays error message on sign-in failure", async () => {
    (signInWithEmail as jest.Mock).mockRejectedValue(new Error("Sign-in failed"));

    render(<SignIn />);

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByTestId('email-sign-in-button'));

    expect(await screen.findByText("Sign-in failed")).toBeInTheDocument();
  });

  it("navigates to reset password page", () => {
    render(<SignIn />);

    fireEvent.click(screen.getByTestId("reset-password-button"));

    expect(mockedRouterPush).toHaveBeenCalledWith("/reset-password");
  });
});
