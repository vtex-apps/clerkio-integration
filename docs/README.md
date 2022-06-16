📢 Use this project, [contribute](https://github.com/vtex-apps/CHANGEME) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# ClerkIO Integration

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

This Apps Allow Stores to integrate with the **Recommendation Shelves** that **ClerkIO Provides.**

## Main Features

1. The app has the option of creating a feed per **language and per binding** supported on the store. 
2. Design of the shelf and the recommendation comes from ClerkIO. 
3. The Store can Declare the ClerkIO Block **anywhere** on their site and configure the **Recommendation Logic** as they need on **VTEX Site-Editor**.


## Configuration VTEX
### Before proceeding please make sure you already have already completed the setup in ClerkIO. 

1. On the **vtex cli** run `vtex install vtex.clerkio-integration@1.1.0`.
    You can confirm that the app has now been installed by running `vtex ls` again. 
2. Access the **Apps** section in your account's admin page and look for the **ClerkIO Integration** box. Once you find it, click on the box.
    Fill in the Fields as requested. For MultiBinding Sites, click on the enable configuration by binding to match a Clerk Store to each Binding. 
3. On your store theme, Add `vtex.clerkio-integration` 1.x as a theme peerDependency in the `manifest.json` file
    
    ```json
    "peerDependencies": {
    "vtex.clerkio-integration": "1.x"
    }
    ```

4. add the `clerkio`block anywhere on your store. Example: in `home.json`

```json
{
  "store.home": {
    "blocks": [
      "responsive-layout.desktop#homepage",
      "responsive-layout.mobile#homepage"
    ]
  },
  "responsive-layout.desktop#homepage": {
    "children": [
      "clerkio",
      ]}
      }
```

5. **for this step onwards, please make sure you have already completed the configuration on ClerkIO steps 1 - 4.**

Go to VTEX Site Editor, and on the right side menu a ClerkIO block will be displayed. Click on it.

6. Fill in the information required on the block.
`Block Class Name`: any name different from clerk.
`Template Name`: insert the ID provided by Clerk on the previously created Content.
`Recommendation Logic`: match the recommendation logic to the one specified on the previously created Content. 

## Configuration ClerkIO
### Before proceeding please make sure you already have already completed the setup in VTEX. 
1. create a new store on ClerkIO dashboard. For multi-binding sites, each binding should be a store on Clerk. 
2. Go to Data -> Data Sync Settings -> Sync Method and Select `ClerkIO JSON Feed`. once prompted to insert the url, insert the following URL format:
`https://{{accountName}}.myvtex.com/_v/clerkio-integration/clerk-feed/{{bindingId}}` 
and click on data sync. **This feed URL is exclusive for the use of ClerkIO.**

If you want to validate your store's feed use this endpoint instead:
`https://app.io.vtex.com/vtex.clerkio-integration/v1/{{accountName}}/{{workspace}}/_v/clerkio-integration/clerk-feed/{{bindingId}}`
this endpoint requires VTEX authentication. 
**Depending on the size of your store Catalogue the feed might take some time to generate**
3. Go to Recommendations -> Design and create a new Shelf design to suit your store Style. 
4. Go to Recommendations -> Content and create a new recommendation using the previously defined Design and the business rule you want to apply. 
Repeat this step for every recommendation rule you want to include on your store. 




