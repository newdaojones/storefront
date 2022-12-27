# Deploy
TEST_SERVER="test.jxndao.com"

TEST_UPLOAD="~/storefront-test/"
PROD_UPLOAD="~/storefront-prod/"
# check axios.ts to enable the right API endpoint
DEPLOY_TARGET=$TEST_UPLOAD


FLAVOR_PATH="src/config"
FLAVOR_CONFIG_FILE="flavorconfig.tsx"

FLAVOR_CONFIG_TEST="flavorconfig.test"
FLAVOR_CONFIG_PROD="flavorconfig.prod"
FLAVOR_CONFIG_TEMP="flavorconfig.temp"

deployTarget=$1
URL=$TEST_SERVER

echo "backing up flavor config ${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE} to ${FLAVOR_PATH}/${FLAVOR_CONFIG_TEMP}"
mv "${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE}" "${FLAVOR_PATH}/${FLAVOR_CONFIG_TEMP}"

if [ "$deployTarget" == "prod" ]
then
  DEPLOY_TARGET=$PROD_UPLOAD
  echo "*************** WARNING: deploying to prod environment ubuntu@${URL}:${DEPLOY_TARGET}************************************"

  cp "${FLAVOR_PATH}/${FLAVOR_CONFIG_PROD}" "${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE}"
  echo "*************** copying flavor config prod: ${FLAVOR_PATH}/${FLAVOR_CONFIG_PROD} to ${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE} ****************************"
else
  cp "${FLAVOR_PATH}/${FLAVOR_CONFIG_TEST}" "${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE}"
  echo "*************** copying flavor config test: ${FLAVOR_PATH}/${FLAVOR_CONFIG_TEST} to ${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE} ****************************"
fi



rm -rf build
yarn build


# Sync version
echo "syncing build to ubuntu@${URL}:${DEPLOY_TARGET}"
rsync -av --progress --stats --human-readable build "ubuntu@${URL}:${DEPLOY_TARGET}"


echo "restoring up flavor config"
cp "${FLAVOR_PATH}/${FLAVOR_CONFIG_TEMP}" "${FLAVOR_PATH}/${FLAVOR_CONFIG_FILE}"

