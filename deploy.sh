# Deploy
URL="depositor.jxndao.com"

TEST_UPLOAD="~/storefront/"

# check axios.ts to enable the right API endpoint
DEPLOY_TARGET=$TEST_UPLOAD
rm -rf build
yarn build
# Sync version
echo "syncing build to ubuntu@${URL}:${DEPLOY_TARGET}"
rsync -av --progress --stats --human-readable build "ubuntu@${URL}:${DEPLOY_TARGET}"

