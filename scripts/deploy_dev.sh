   #!/bin/bash

   docker compose -f docker-compose.dev.yml down

   docker compose -f docker-compose.dev.yml up --build

   docker compose -f docker-compose.dev.yml logs -f