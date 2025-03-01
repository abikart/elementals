# Elementals

Elementals is a zero-dependency web component library built on native HTML elements with an advanced theming system. The project follows a "static vs. dynamic" first principle, where components add only the functionality missing from native elements without using Shadow DOM.

## Key Features

- **Native Element Enhancement**: Wraps and extends HTML elements rather than replacing them
- **Zero Dependencies**: Built entirely on platform APIs for minimal footprint
- **Progressive Enhancement**: Components function even when JavaScript fails
- **Advanced Theming**: Multi-tiered token system with premium brand themes
- **Figma Integration**: Bidirectional synchronization between code and design tools
- **LLM-Optimized**: Structured for AI understanding and generation of UI components

## Core Architecture

- **First Principles**: Components separate static (built-in) from dynamic (configurable) features
- **Implementation Approach**: Web component wrappers around native HTML elements, no Shadow DOM

## Design System

- **Token Architecture**: Three-tier system (brand → semantic → component)
- **Theming Strategy**: CSS custom properties with predictable naming patterns
- **Brand Archetypes**: Defined visual patterns for different brand styles

## Component Design

- **API Philosophy**: Minimal, predictable interfaces with self-documenting properties
- **Composition Model**: Components build on native HTML semantics
- **State Management**: Support for both controlled and uncontrolled component patterns

## Business Model

The core component library is open source, with monetization through premium themes and tooling. This drives adoption while creating sustainable revenue.

## Target Users

- Developers seeking lightweight, accessible components with native behavior
- Design teams requiring accurate implementation of brand guidelines
- Organizations building LLM-powered interfaces with brand consistency

## Context Organization

- **Repository Level**: /llms.txt.md (this file) provides the global overview
- **Package Level**: Each package/subdirectory might have a context.md file with domain-specific information
- **Component Level**: Individual component files contain detailed implementation context
- **Usage**: These context files are designed for developers and LLMs to quickly understand project architecture