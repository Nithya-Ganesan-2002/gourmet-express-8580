#!/bin/bash
cd /home/kavia/workspace/code-generation/gourmet-express-8580/food_delivery_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

