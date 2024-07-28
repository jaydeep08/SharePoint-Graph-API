# SharePoint-Graph-APIs
## Enable SharePoint site app-catalog
   1) Download and install *SharePoint Online Management Shell* from https://www.microsoft.com/en-us/download/details.aspx?id=35588
   2) Open *SharePoint Online Management Shell* and connect with Sharepoint online site, use commands
      ##
          Connect-SPOService -Url https://jay0808-admin.sharepoint.com
   3) Install *SharePointPnPPowerShellOnline*
      ##
          Install-Module SharePointPnPPowerShellOnline
   4) Enable app catalog on site *https://jay0808.sharepoint.com/sites/Jaydeep*
      ##
          Add-SPOSiteCollectionAppCatalog -Site "https://jay0808.sharepoint.com/sites/Jaydeep"

## SPFx project setup commands (for node version 14.21.3) 
*for latest version of node use below cammands without specifing version* 
   1) Install SPFx
      ##
          npm install -g @microsoft/generator-sharepoint@1.15.0
   3) Install Yeamon
      ##
          npm install -g yo@4.3.0
   5) Install Gulp  
      ##
          npm install -g gulp
   6) Create SPFx solution
      ##
          yo @microsoft/sharepoint

## Configure fast serve (To build and test application faster)
   ##
    npm install spfx-fast-serve@3.0.7 -g
   ##
    spfx-fast-serve
   ## 
    npm install
   **Now application is ready to build nad test, use command**
   ##
    npm run serve

## Build and deploy SPFx solution

   1) Clean the older builds
      ##
          gulp clean
   2) Build and bundle the solution
      ##
          gulp bundle --ship
   3) Packahe the solution
      ##
          gulp package-solution --ship

# Graph API setup
##
   ```javascript
   protected onInit(): Promise<void> {
      this._environmentMessage = this._getEnvironmentMessage();
      
      return super.onInit();
   }
   ```
   ```javascript
   
   
