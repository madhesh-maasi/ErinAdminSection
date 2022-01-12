import * as React from "react";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenuItemType,
  IDropdownStyles,
  IDropdownOption,
} from "@fluentui/react/lib/Dropdown";
import { SearchBox, ISearchBoxStyles } from "@fluentui/react/lib/SearchBox";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Icon } from "@fluentui/react/lib/Icon";
import styles from "./AdminDashboard.module.scss";
import { loadTheme, createTheme, Theme } from "@fluentui/react";
let allItems = [];
let statusOptions = [];
const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 300 } };
const blueTheme = createTheme({
  palette: {
    themePrimary: "#004fa2",
    themeLighterAlt: "#f1f6fb",
    themeLighter: "#cadcf0",
    themeLight: "#9fc0e3",
    themeTertiary: "#508ac8",
    themeSecondary: "#155fae",
    themeDarkAlt: "#004793",
    themeDark: "#003c7c",
    themeDarker: "#002c5b",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});
// const defaultBtnStyles = {
//   root: { color: "#004FA2", borderColor: "#004FA2" },
//   rootHovered: {
//     color: "#004FA2",
//   },
//   rootFocused: {
//     color: "#004FA2",
//   },
// };
const options: IDropdownOption[] = [
  { key: "WellsFargo", text: "Wells Fargo" },
  { key: "NonWellsFargo", text: "Non Wells Fargo" },
];
loadTheme(blueTheme);
const App = (props) => {
  const [items, setItems] = useState([]);
  const [fetchList, setFetchList] = useState(true);
  useEffect(() => {
    if (fetchList) {
      props.spcontext.web.lists
        .getByTitle("WFQuoteRequestList")
        .fields.filter("EntityPropertyName eq 'Status'")
        .get()
        .then(async (statChoices) => {
          statChoices[0].Choices.forEach((choice) => {
            statusOptions.push({
              key: choice,
              text: choice,
            });
          });

          await props.spcontext.web.lists
            .getByTitle("WFQuoteRequestList")
            .items.select("*,UserDetails/Title,UserDetails/EMail")
            .expand("UserDetails")
            .get()
            .then((wfItems: any) => {
              console.log(wfItems);

              wfItems.forEach((wfItem) => {
                allItems.push({
                  ClientName: "Wells Fargo",
                  OrderNo: wfItem.OrderNo,
                  AssignedTo: wfItem.UserDetails
                    ? wfItem.UserDetails[0].Title
                    : "",
                  StartDate: "11/12/2021",
                  EndDate: "10/20/2021",
                  Status: (
                    <Dropdown
                      placeholder="Select an option"
                      options={statusOptions}
                      styles={{ root: { width: 150 } }}
                      onChange={(e, selected) => {
                        props.spcontext.web.lists
                          .getByTitle("WFQuoteRequestList")
                          .items.getById(wfItem.ID)
                          .update({
                            Status: selected.key,
                          })
                          .then(() => {
                            setFetchList(true);
                            console.log("working");
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }}
                      defaultSelectedKey={wfItem.Status}
                    />
                  ),
                  Quote:
                    wfItem.Status == "Quoted waiting on PO" ? (
                      <DefaultButton
                        text="Submit Quote"
                        onClick={() => {
                          console.log(wfItem.ID);
                          window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/WellsFargoQuoteForm.aspx?formID=${wfItem.ID}`;
                        }}
                        allowDisabledFocus
                      />
                    ) : (
                      <Icon
                        iconName="Money"
                        onClick={() => {
                          window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/WellsFargoQuoteView.aspx?formID=${wfItem.ID}`;
                        }}
                        styles={{
                          root: {
                            fontSize: 24,
                            fontWeight: 400,
                            color: "#004FA2",
                            cursor: "pointer",
                          },
                        }}
                      />
                    ),
                  InternalForm:
                    wfItem.internalFormGenerated == true ? (
                      <Icon
                        iconName="PageSolid"
                        styles={{
                          root: {
                            fontSize: 24,
                            fontWeight: 400,
                            cursor: "pointer",
                            color: "#004FA2",
                          },
                        }}
                        onClick={() => {
                          window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/InternalForm.aspx?RequestType=WF&RequestId=${wfItem.ID}`;
                        }}
                      />
                    ) : (
                      ""
                    ),
                  ProjectNo: !wfItem.ProjectNo ? (
                    <Icon
                      iconName="Edit"
                      styles={{
                        root: {
                          fontSize: 24,
                          fontWeight: 400,
                          cursor: "pointer",
                          color: "#004FA2",
                        },
                      }}
                    />
                  ) : (
                    wfItem.ProjectNo
                  ),
                });
              });
            })
            .then(() => {
              props.spcontext.web.lists
                .getByTitle("NWFQuoteRequestList")
                .items.select("*,UserDetails/Title,UserDetails/EMail")
                .expand("UserDetails")
                .get()
                .then((nwfItems: any) => {
                  nwfItems.forEach((nwfItem) => {
                    allItems.push({
                      ClientName: "Non Wells Fargo",
                      OrderNo: nwfItem.OrderNo,
                      AssignedTo: nwfItem.UserDetails
                        ? nwfItem.UserDetails[0].Title
                        : "",
                      StartDate: "11/12/2021",
                      EndDate: "10/20/2021",
                      Status: (
                        <Dropdown
                          placeholder="Select an option"
                          options={statusOptions}
                          styles={{ root: { width: 150 } }}
                          defaultSelectedKey={nwfItem.Status}
                          onChange={(e, selected) => {
                            props.spcontext.web.lists
                              .getByTitle("NWFQuoteRequestList")
                              .items.getById(nwfItem.ID)
                              .update({
                                Status: selected.key,
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          }}
                        />
                      ),
                      Quote:
                        nwfItem.Status == "Quoted waiting on PO" ? (
                          <DefaultButton
                            text="Submit Quote"
                            onClick={() => {
                              console.log(nwfItem.ID);
                            }}
                            allowDisabledFocus
                          />
                        ) : (
                          <Icon
                            iconName="Money"
                            styles={{
                              root: {
                                fontSize: 24,
                                fontWeight: 400,
                                cursor: "pointer",
                                color: "#004FA2",
                              },
                            }}
                          />
                        ),
                      InternalForm:
                        nwfItem.internalFormGenerated == true ? (
                          <Icon
                            iconName="PageSolid"
                            styles={{
                              root: {
                                fontSize: 24,
                                fontWeight: 400,
                                cursor: "pointer",
                                color: "#004FA2",
                              },
                            }}
                            onClick={() => {
                              window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/InternalForm.aspx?RequestType=NWF&RequestId=${nwfItem.ID}`;
                            }}
                          />
                        ) : (
                          ""
                        ),
                      ProjectNo: !nwfItem.ProjectNo ? (
                        <Icon
                          iconName="Edit"
                          styles={{
                            root: {
                              fontSize: 24,
                              fontWeight: 400,
                              cursor: "pointer",
                              color: "#004FA2",
                            },
                          }}
                        />
                      ) : (
                        nwfItem.ProjectNo
                      ),
                    });
                  });
                });
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setItems(allItems);
    setFetchList(false);
  }, [fetchList]);
  const companyDropdownChangeHandler = (selectedItem) => {
    console.log(selectedItem);
    setItems(allItems.filter((item) => item.ClientName === selectedItem.text));
  };
  const columns: IColumn[] = [
    {
      key: "1",
      name: "Clinet Name",
      fieldName: "ClientName",
      minWidth: 100,
      maxWidth: 120,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "2",
      name: "Order No",
      fieldName: "OrderNo",
      minWidth: 100,
      maxWidth: 120,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "3",
      name: "Start Date",
      fieldName: "StartDate",
      minWidth: 80,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "4",
      name: "End Date",
      fieldName: "EndDate",
      minWidth: 80,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "string",
      isPadded: true,
    },
    {
      key: "5",
      name: "Status",
      fieldName: "Status",
      minWidth: 120,
      maxWidth: 150,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "any",
      isPadded: true,
    },
    {
      key: "6",
      name: "Quote",
      fieldName: "Quote",
      minWidth: 100,
      maxWidth: 120,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "any",
      isPadded: true,
    },
    {
      key: "7",
      name: "Internal Form",
      fieldName: "InternalForm",
      minWidth: 50,
      maxWidth: 100,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "any",
      isPadded: true,
    },
    {
      key: "8",
      name: "Project No",
      fieldName: "ProjectNo",
      minWidth: 50,
      maxWidth: 80,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: "Sorted A to Z",
      sortDescendingAriaLabel: "Sorted Z to A",
      data: "any",
      isPadded: true,
    },
  ];
  //   setItems(allItems);
  return (
    <Fragment>
      <div className={styles.dashboardHeader}>
        <Dropdown
          placeholder="Select an option"
          options={options}
          styles={dropdownStyles}
          onChange={(e, selectedItem) => {
            companyDropdownChangeHandler(selectedItem);
          }}
        />
        <SearchBox
          styles={searchBoxStyles}
          placeholder="Search"
          onEscape={(ev) => {
            console.log("Custom onEscape Called");
          }}
          onClear={(ev) => {
            console.log("Custom onClear Called");
          }}
          onChange={(_, newValue) =>
            setItems(
              allItems.filter((item) =>
                item.OrderNo.toLowerCase().includes(newValue.toLowerCase())
              )
            )
          }
          onSearch={(newValue) => {
            console.log("SearchBox onSearch fired: " + newValue);
            setItems(
              allItems.filter((item) =>
                item.OrderNo.toLowerCase().includes(newValue.toLowerCase())
              )
            );
          }}
        />
      </div>
      <DetailsList
        items={items}
        columns={columns}
        selectionMode={SelectionMode.none}
        setKey="none"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
      />
    </Fragment>
  );
};
export default App;
