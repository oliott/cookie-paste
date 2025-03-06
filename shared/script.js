const containerRowDivClassName = "container-row";
const containerColumnDivClassName = "container-column";
const evenClassName = "even-row";

async function getContextualIdentities() {
  const contextualIdentities = await browser.contextualIdentities.query({});
  const arrayContextualIdentities = [];
  const jsonContextualIdentities = {};
  const bookmarkPromises = contextualIdentities.map(
    async (contextualIdentity, index) => {
      const ourRepresentation = {
        cookieStoreName: contextualIdentity.name,
        cookieStoreId: contextualIdentity.cookieStoreId,
        isEven: index % 2 == 0,
      };

      // TODO: This should be removed before next release.
      var potential_profile_bookmarks = await browser.bookmarks.search({
        title: `AWS ${contextualIdentity.name}`,
      });

      if (potential_profile_bookmarks.length > 0) {
        // Yeah we are just taking first element deal with it.
        ourRepresentation["bookMarkUrl"] = potential_profile_bookmarks[0].url;
        //"https://bob.awsapps.com/start/#/console?account_id=000000000000&role_name=ReadOnly"
        ourRepresentation["targetRoleName"] =
          potential_profile_bookmarks[0].url.split("=")[2];
        ourRepresentation["targetAccountId"] =
          potential_profile_bookmarks[0].url.split("=")[1].split("&")[0];
      }
      arrayContextualIdentities.push(ourRepresentation);
      jsonContextualIdentities[contextualIdentity.cookieStoreId] =
        ourRepresentation;
    },
  );

  await Promise.all(bookmarkPromises);
  return jsonContextualIdentities;
}
