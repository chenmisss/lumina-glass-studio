import { render, screen } from '@testing-library/react';
import GlassCard from './GlassCard';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('GlassCard Component', () => {
    it('renders children correctly', () => {
        render(
            <GlassCard>
                <div data-testid="child-content">Test Content</div>
            </GlassCard>
        );
        expect(screen.getByTestId('child-content')).toHaveTextContent('Test Content');
    });

    it('applies custom className', () => {
        const { container } = render(
            <GlassCard className="custom-test-class">
                <div>Content</div>
            </GlassCard>
        );
        // Find the first div inside container (which is the component wrapper)
        // Note: React Testing Library renders into a div container.
        expect(container.firstChild).toHaveClass('custom-test-class');
    });

    it('renders correctly with default props', () => {
        const { container } = render(
            <GlassCard>
                <div>Content</div>
            </GlassCard>
        );
        expect(container.firstChild).toHaveClass('backdrop-blur-md'); // default blur
    });
});
