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
    ```"peerDependencies": {
    "vtex.clerkio-integration": "1.x"
  },```
4. add the `clerkio`block anywhere on your store. Example: in `home.json`
```{
  "store.home": {
    "blocks": [
      "responsive-layout.desktop#homepage",
      "responsive-layout.mobile#homepage"
    ]
  },
  "responsive-layout.desktop#homepage": {
    "children": [
      "clerkio",
```
