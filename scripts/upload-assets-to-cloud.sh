PROJECT_NAME="your-project"
RCLONE_PROFILE_NAME="your-rclone-profile"
echo "CloudDeploy v3.1"

# Check if DEPLOY_ENV is set
if [ -z "$DEPLOY_ENV" ]; then
    echo "Error: DEPLOY_ENV environment variable is not set"
    echo "Usage: DEPLOY_ENV=<environment> ./deploy-cloud.sh"
    echo "Where <environment> can be: local, test, site"
    echo "Optional: NO_RCLONE=1"
    exit 1
fi

echo "Upload dist/.assets to Bucket"
# Safer rclone defaults for large files; can be overridden via RCLONE_FLAGS env var
: "${RCLONE_FLAGS:=--checksum --retries 5 --low-level-retries 10 --retries-sleep 2s --timeout 5m --contimeout 30s --transfers 4 --checkers 8}"
# If using S3-compatible backends, these help with multi-part stability; harmless on others
EXTRA_S3_FLAGS="--s3-chunk-size 16M --s3-upload-concurrency 2"
if [ -n "$NO_RCLONE" ]; then
    echo "Warning: NO_RCLONE is set"
else
    rclone copy $RCLONE_FLAGS $EXTRA_S3_FLAGS ../dist/.assets $RCLONE_PROFILE_NAME:/"$PROJECT_NAME"/"$DEPLOY_ENV"
fi
echo "Upload - Ok"

echo "Finish"