## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Steps to create the Nextjs client

1. Go to https://rayniel95.github.io/ecdsa-node/

### Steps to create the node server

1. Install [Docker](https://www.docker.com/)
2. Download the project
3. Open a terminal in the project folder
4. Build the image, execute: `docker build ./ -f Dockerfile-node -t server-node`
5. Run the container, execute: `docker run -it -p 3042:3042 server-node`

### TODO
- [ ] add golang server
- [ ] add rust server
- [ ] add sign the message using custom private key on frontend
