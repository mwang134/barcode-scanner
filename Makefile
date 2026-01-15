.PHONY: help install dev build start lint clean clean-all

# Default target
help:
	@echo "Available targets:"
	@echo "  make install    - Install npm dependencies"
	@echo "  make dev        - Run development server"
	@echo "  make build      - Build for production"
	@echo "  make start      - Start production server"
	@echo "  make lint       - Run linter"
	@echo "  make clean      - Clean build artifacts and node_modules"
	@echo "  make clean-all  - Clean everything including package-lock.json"

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Start production server (requires build first)
start:
	npm run start

# Run linter
lint:
	npm run lint

# Clean build artifacts and intermediate files
clean:
	rm -rf .next
	rm -rf out
	rm -rf .turbo
	rm -rf node_modules
	find . -type d -name ".next" -prune -exec rm -rf {} \;
	@echo "Cleaned build artifacts and node_modules"

# Clean everything including package-lock.json
clean-all: clean
	rm -f package-lock.json
	@echo "Cleaned all files including package-lock.json"

