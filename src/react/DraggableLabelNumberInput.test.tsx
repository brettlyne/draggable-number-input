import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DraggableLabelNumberInput } from "./DraggableLabelNumberInput";

// mock requestPointerLock since it's not available in JSDOM
const mockRequestPointerLock = jest.fn();
Element.prototype.requestPointerLock = mockRequestPointerLock;

describe("DraggableLabelNumberInput", () => {
  beforeEach(() => {
    mockRequestPointerLock.mockClear();
  });

  it("renders label and input with initial value", () => {
    render(<DraggableLabelNumberInput value={42}>Test Label</DraggableLabelNumberInput>);
    const label = screen.getByText("Test Label");
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("42");
  });

  it("calls onChange when typing a new value", () => {
    const handleChange = jest.fn();
    render(<DraggableLabelNumberInput value={42} onChange={handleChange}>Test Label</DraggableLabelNumberInput>);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "50" } });
    expect(handleChange).toHaveBeenCalledWith(50);
  });

  it("handles invalid input by maintaining the last valid value on blur", () => {
    const handleChange = jest.fn();
    render(<DraggableLabelNumberInput value={42} onChange={handleChange}>Test Label</DraggableLabelNumberInput>);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("42");
  });

  it("calls onDragStart and onDragEnd when dragging", () => {
    const handleDragStart = jest.fn();
    const handleDragEnd = jest.fn();

    render(
      <DraggableLabelNumberInput
        value={42}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        Test Label
      </DraggableLabelNumberInput>
    );

    const label = screen.getByText("Test Label");
    fireEvent.mouseDown(label);

    // Simulate mouse movement to trigger drag start
    fireEvent.mouseMove(label, { clientX: 100, movementX: 10 });

    expect(handleDragStart).toHaveBeenCalled();
    expect(mockRequestPointerLock).toHaveBeenCalled();

    fireEvent.mouseUp(label);
    expect(handleDragEnd).toHaveBeenCalled();
  });

  it("applies custom className and style", () => {
    const customStyle = { width: "200px" };
    const customClass = "custom-input";
    const customInputClass = "custom-input-field";

    render(
      <DraggableLabelNumberInput
        value={42}
        className={customClass}
        inputClassName={customInputClass}
        style={customStyle}
      >
        Test Label
      </DraggableLabelNumberInput>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveClass(customInputClass);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(customClass);
    expect(label).toHaveStyle(customStyle);
  });

  it("respects disablePointerLock prop", () => {
    render(
      <DraggableLabelNumberInput value={42} disablePointerLock>
        Test Label
      </DraggableLabelNumberInput>
    );

    const label = screen.getByText("Test Label");
    fireEvent.mouseDown(label);
    expect(mockRequestPointerLock).not.toHaveBeenCalled();
  });

  it("updates value when dragging", () => {
    const handleChange = jest.fn();
    render(
      <DraggableLabelNumberInput
        value={42}
        onChange={handleChange}
        disablePointerLock
      >
        Test Label
      </DraggableLabelNumberInput>
    );

    const label = screen.getByText("Test Label");

    fireEvent.mouseDown(label, { clientX: 0, buttons: 1 });
    fireEvent.mouseMove(document, { clientX: 0 }); // initial move to initiate drag start
    fireEvent.mouseMove(document, { clientX: 10 }); // move to incrememnt value
    expect(handleChange).toHaveBeenLastCalledWith(52);

    fireEvent.keyDown(document, { key: "Shift", shiftKey: true });
    fireEvent.mouseMove(document, { clientX: 20, shiftKey: true });
    expect(handleChange).toHaveBeenLastCalledWith(140);

    fireEvent.mouseUp(label);
    fireEvent.keyUp(document, { key: "Shift", shiftKey: false });
  });

  it("supports noInput mode", () => {
    render(
      <DraggableLabelNumberInput value={42} noInput>
        Test Label
      </DraggableLabelNumberInput>
    );

    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
