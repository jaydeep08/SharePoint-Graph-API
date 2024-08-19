import { graphClient, siteId, Context } from './graphConfig';
import { SPHttpClient } from '@microsoft/sp-http';

export class GraphHelper {
    // Get current user (Graph API)
    public async getCurrentUser() {
        try {
            const response = await graphClient.api('/me').get();
            console.log("current user -----", response);
            return response;
        } catch (error) {
            console.log("CurrentUser api error", error);
            return [];
        }
    }

    // Get current user (REST API)
    public async getCurrentUserSP() {
        try {
            const queryUrl = `${Context.pageContext.site.absoluteUrl}/_api/web/currentuser`;
            const currentUserData = await Context.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
            const currentUser = (await currentUserData.json());
            return currentUser;
        } catch (error) {
            console.log("list error", error);
            return [];
        }
    }

    // Get current user groups (REST API)
    public async getCurrentUserGroups() {
        try {
            const queryUrl = `${Context.pageContext.site.absoluteUrl}/_api/web/currentuser/groups`;
            const siteGroupsData = await Context.spHttpClient.get(queryUrl, SPHttpClient.configurations.v1);
            const siteGroups = (await siteGroupsData.json()).value;
            return siteGroups;
        } catch (error) {
            console.log("current user groups REST API error", error);
            return [];
        }
    }

    // Get current user is SCA (Graph API)
    public async getCurrentIsSCA() {
        try {
            const response = await graphClient.api(`/sites/${siteId}/lists/User Information List/items?expand=fields`).get();
            const email = Context.pageContext.user.email;
            const SCA = response.value.filter((x) => x.fields.EMail === email);
            const isSCA = SCA === undefined ? false : SCA[0].fields.IsSiteAdmin;
            return isSCA;
        } catch (error) {
            console.log("IsSCA user error", error);
            return [];
        }
    }

    // Get all site lists (Graph API)
    public async getAllLists() {
        try {
            const response = await graphClient.api(`/sites/${siteId}/lists`).get();
            console.log("All Lists -----", response);
            return response;
        } catch (error) {
            console.log("Get all site lists error", error);
            return [];
        }
    }

    // Get list items (Graph API)
    public async getListItem(listId, listParams="") {
        try {
            const response = await graphClient.api(`/sites/${siteId}/lists/${listId}/items?expand=fields${listParams}`).get();
            console.log("~~~~~~~~~~~~List Items~~~~~~~~~~~~", response);
            return response;
        } catch (error) {
            console.log("list error", error);
            return [];
        }
    }

    // Get list item by id (Graph API)
    public async getListItemById(listId, itemId) {
        try {
            const response = await graphClient.api(`/sites/${siteId}/lists/${listId}/items/${itemId}`).get();
            console.log("~~~~~~~~~~~~List Item~~~~~~~~~~~~", response.fields);
            return response.fields;
        } catch (error) {
            console.log("list error", error);
            return [];
        }
    }

    // Get site user list (Graph API)
    public async getSiteUserListItems() {
        try {
            const userInfoList = await graphClient.api(`/sites/${siteId}/lists?$filter=DisplayName eq 'User Information List'`).get();
            const userList = await graphClient.api(`/sites/${siteId}/lists/${userInfoList.value[0].id}/items?expand=fields`).get();
            console.log("~~~~~~~~~~~~User list~~~~~~~~~~~~", userList);
            return userList;
        } catch (error) {
            console.log("site user list (Graph API) error", error);
            return [];
        }
    }

  // Method to get list items with selected columns, people picker columns, and optional filters
//   public async getListItems(listId, selectedColumns = [], peoplePickerColumns = [], filterString = null, sortString = null, top = 2000) {
//     try {
//       let queryParams = [];
//       let columnsToSelect = [...selectedColumns];

//       if (peoplePickerColumns && peoplePickerColumns.length > 0) {
//         const temp = peoplePickerColumns.map(col => `${col}LookupId`);
//         columnsToSelect.push(...temp);
//       }

//       if (columnsToSelect && columnsToSelect.length > 0) {
//         queryParams.push(`$select=${columnsToSelect.join(",")}`);
//       } else {
//         queryParams.push(``);
//       }

//       if (filterString && filterString !== "") {
//         queryParams.push(`$filter=fields/${filterString}`);
//       }

//       if (sortString && sortString !== "") {
//         queryParams.push(`$orderBy=fields/${sortString}`);
//       }

//       if (top) {
//         queryParams.push(`$top=${top}`);
//       }

//       const listParams = queryParams.length > 0 ? queryParams.join("&") : "";

//       console.log("----------------", listParams);

//       const listResponse = await this.getListItem(listId, listParams);
//       const items = listResponse.value;

//       let userDataMap;
//       if (peoplePickerColumns && peoplePickerColumns.length > 0) {
//         const usersPromise = this.getSiteUserListItems();
//         const userResponse = await usersPromise;
//         userDataMap = new Map(userResponse.value.map(item => [item.id, item.fields]));
//       }

//       const listItems = items.map(item => {
//         peoplePickerColumns.forEach((col) => {
//           if (item.fields[`${col}LookupId`]) {
//             item.fields[`${col}`] = userDataMap.get(item.fields[`${col}LookupId`]);
//           }
//         });

//         return item.fields;
//       });

//       return listItems;

//     } catch (error) {
//       console.log("get list items with filters error", error);
//       return [];
//     }
//   }



  public async getListItems(
    listId: string,
    selectedColumns = "",
    peoplePickerColumns = "",
    filterString: string | null = null,
    sortString: string | null = null,
    top: number = 2000
  ): Promise<any[]> {
    try {
      // Combine selectedColumns and peoplePickerColumns directly
      const columnsToSelect = [
        selectedColumns,
        peoplePickerColumns.split(',').map(col => col.trim()?`${col.trim()}LookupId`:'').join(',')
      ].filter(Boolean).join(',');
      console.log(columnsToSelect)
  
      // Construct query parameters
      const queryParams = [
        columnsToSelect ? `($select=${columnsToSelect})` : '',
        filterString ? `$filter=fields/${filterString}` : '',
        sortString ? `$orderBy=fields/${sortString}` : '',
        top ? `$top=${top}` : ''
      ].filter(Boolean).join('&');
  
      console.log("Query Parameters: ", queryParams);
  
      // Fetch list items
      const listResponse = await this.getListItem(listId, queryParams);
      const items = listResponse.value;
  
      if (peoplePickerColumns) {
        const userResponse = await this.getSiteUserListItems();
        const userDataMap = new Map(userResponse.value.map(item => [item.id, item.fields]));
  
        const listItems = items.map(item => {
          peoplePickerColumns.split(',').map(col => col.trim()).forEach(col => {
            if (item.fields[`${col}LookupId`]) {
              item.fields[col] = userDataMap.get(item.fields[`${col}LookupId`]);
            }
          });
          return item.fields;
        });
  
        return listItems;
      } else {
        return items;
      }
    } catch (error) {
      console.error("getListItems error:", error);
      return [];
    }
  }
  

}

export default GraphHelper;
