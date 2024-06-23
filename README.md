# Live Chat Highlight 

## Overview
This is a simple Node.js application that utilizes the `express`, `path`, and `ws` packages. This README will guide you through setting up the project and understanding its structure.

## Getting Started

### Prerequisites
Ensure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the repository** (or create a new directory for your project):
    ```sh
    git clone https://github.com/PlayQuartz/LiveChatHighlight.git
    ```


2. **Initialize the project**:
    If you haven't already created a `package.json` file, you can initialize one using:
    ```sh
    npm init -y
    ```

3. **Add the dependencies**:
    Create or update your `package.json` file with the following content:
    ```json
    {
      "name": "LiveChatHighlight",
      "version": "1.0.0",
      "main": "server.js",
      "scripts": {
        "start": "node server.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "path": "^0.12.7",
        "ws": "^8.5.0"
      }
    }
    ```

4. **Install the dependencies**:
    Run the following command to install the required npm packages:
    ```sh
    npm install
    ```

### Configuration

1. **Update the `config.json` file**:
    In the root directory of your project, you will find a `config.json` file with the following structure:
    ```json
    {
        "twitch_auth": "oauth:your_twitch_auth_key",
        "twitch_username": "your_twitch_username"
    }
    ```

2. **Fill in your Twitch details**:
    - **twitch_auth**: Replace `your_twitch_auth_key` with your Twitch authentication key.
    - **twitch_username**: Replace `your_twitch_username` with your actual Twitch username.

    You can obtain your Twitch authentication key from the Twitch Developer Console. Make sure to securely store this key and not expose it publicly.

### Running the Application

To start the application, use the following command:
```sh
npm start
