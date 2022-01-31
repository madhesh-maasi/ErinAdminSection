import * as React from "react";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useBoolean } from "@fluentui/react-hooks";
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
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
// import { Icon } from "@fluentui/react/lib/Icon";
import styles from "./AdminDashboard.module.scss";
import {
  loadTheme,
  createTheme,
  Theme,
  TextField,
  ThemeProvider,
  PartialTheme,
} from "@fluentui/react";
import Pagination from "office-ui-fabric-react-pagination";
import {
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import { Icon } from "office-ui-fabric-react/lib/Icon";
let allItems = [];
let constructedItems = [];
let statusOptions: IDropdownOption[] = [];
let currID;
let currentpage = 1;
var totalPage = 30;
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
const redTheme = createTheme({
  palette: {
    themePrimary: "#d71e2b",
    themeLighterAlt: "#fdf5f5",
    themeLighter: "#f8d6d9",
    themeLight: "#f3b4b8",
    themeTertiary: "#e77078",
    themeSecondary: "#db3540",
    themeDarkAlt: "#c11b26",
    themeDark: "#a31720",
    themeDarker: "#781118",
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
const dialogStyles = { main: { maxWidth: 450 } };

const options: IChoiceGroupOption[] = [
  { key: "All", text: "All" },
  { key: "WellsFargo", text: "Wells Fargo" },
  { key: "NonWellsFargo", text: "Non Wells Fargo" },
];
loadTheme(blueTheme);
const modelProps = {
  isBlocking: true,
  topOffsetFixed: true,
  styles: { main: { maxWidth: 450 } },
};

const App = (props) => {
  const [items, setItems] = useState([]);
  const [fetchList, setFetchList] = useState(false);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [ProjectNo, setProjectNo] = useState("");
  const [isWFItem, setIsWFItem] = useState(false);

  useEffect(() => {
    props.spcontext.web.lists
      .getByTitle("WFQuoteRequestList")
      .fields.filter("EntityPropertyName eq 'Status'")
      .get()
      .then(async (statChoices) => {
        statChoices[0].Choices.forEach((choice) => {
          statusOptions.push({
            key: choice,
            text: choice,
            title: choice,
          });
        });

        await props.spcontext.web.lists
          .getByTitle("WFQuoteRequestList")
          .items.select("*,UserDetails/Title,UserDetails/EMail")
          .expand("UserDetails")
          .orderBy("Modified", false)
          .get()
          .then((wfItems: any) => {
            console.log(wfItems);

            wfItems.forEach((wfItem) => {
              allItems.push({
                ID: wfItem.ID,
                ClientName: "Wells Fargo",
                OrderNo: wfItem.OrderNo,
                AssignedTo: wfItem.UserDetails
                  ? wfItem.UserDetails[0].Title
                  : "",
                StartDate: wfItem.StartDate
                  ? new Date(wfItem.StartDate).toLocaleDateString()
                  : "",
                EndDate: wfItem.EndDate
                  ? new Date(wfItem.EndDate).toLocaleDateString()
                  : "",
                Status: wfItem.Status,
                Quote: "",
                InternalForm: "",
                ProjectNo: wfItem.ProjectNo,
              });
            });
          })
          .then(async () => {
            await props.spcontext.web.lists
              .getByTitle("NWFQuoteRequestList")
              .items.select("*,UserDetails/Title,UserDetails/EMail")
              .expand("UserDetails")
              .orderBy("Modified", false)
              .get()
              .then((nwfItems: any) => {
                nwfItems.forEach((nwfItem) => {
                  allItems.push({
                    ID: nwfItem.ID,
                    ClientName: "Non Wells Fargo",
                    OrderNo: nwfItem.OrderNo,
                    AssignedTo: nwfItem.UserDetails
                      ? nwfItem.UserDetails[0].Title
                      : "",
                    StartDate: nwfItem.StartDate,
                    EndDate: nwfItem.EndDate,
                    Status: nwfItem.Status,
                    Quote: "",
                    InternalForm: "",
                    ProjectNo: nwfItem.ProjectNo,
                  });
                });
              });
            await setFetchList(true);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(allItems);
  }, []);

  // TODO Table Construction
  useEffect(() => {
    if (fetchList) {
      constructedItems = allItems.map((lItem) => {
        return {
          ID: lItem.ID,
          ClientName: lItem.ClientName,
          OrderNo: lItem.OrderNo,
          AssignedTo: lItem.AssignedTo,
          StartDate: lItem.StartDate
            ? new Date(lItem.StartDate).toLocaleDateString()
            : "N/A",
          EndDate: lItem.EndDate
            ? new Date(lItem.EndDate).toLocaleDateString()
            : "N/A",
          Status: (
            <ThemeProvider
              theme={lItem.ClientName == "Wells Fargo" ? redTheme : blueTheme}
            >
              <Dropdown
                placeholder="Select an option"
                id={`${lItem.ID}`}
                options={statusOptions}
                styles={{ root: { width: 330 } }}
                onChange={(e, selected) => {
                  props.spcontext.web.lists
                    .getByTitle(
                      lItem.ClientName == "Wells Fargo"
                        ? "WFQuoteRequestList"
                        : "NWFQuoteRequestList"
                    )
                    .items.getById(lItem.ID)
                    .update({
                      Status: selected.key,
                    })
                    .then(() => {
                      if (lItem.ClientName == "Wells Fargo") {
                        console.log(
                          allItems.filter(
                            (item) =>
                              item.ClientName == "Wells Fargo" &&
                              item.ID == e.target["id"]
                          )
                        );

                        allItems.filter(
                          (item) =>
                            item.ClientName == "Wells Fargo" &&
                            item.ID == e.target["id"]
                        )[0].Status = selected.key;
                      } else {
                        console.log(
                          allItems.filter(
                            (item) =>
                              item.ClientName == "Non Wells Fargo" &&
                              item.ID == e.target["id"]
                          )
                        );

                        allItems.filter(
                          (item) =>
                            item.ClientName == "Non Wells Fargo" &&
                            item.ID == e.target["id"]
                        )[0].Status = selected.key;
                      }

                      setFetchList(true);
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                defaultSelectedKey={lItem.Status}
              />
            </ThemeProvider>
          ),
          Quote:
            lItem.Status == "Quoted waiting on PO" ||
            lItem.Status ==
              "PO received order entered into production queue" ? (
              <DefaultButton
                text="Submit Quote"
                onClick={() => {
                  console.log(lItem.ID);
                  lItem.ClientName == "Wells Fargo"
                    ? (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/WellsFargoQuoteForm.aspx?formID=${lItem.ID}`)
                    : (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/NonWellsFargoQuoteForm.aspx?formID=${lItem.ID}`);
                }}
                allowDisabledFocus
              />
            ) : (
              <div style={{ width: "100%", textAlign: "center" }}>
                <Icon
                  iconName="PageData"
                  onClick={() => {
                    lItem.ClientName == "Wells Fargo"
                      ? (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/WellsFargoQuoteView.aspx?formID=${lItem.ID}`)
                      : (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/NonWellsFargoQuoteView.aspx?formID=${lItem.ID}`);
                  }}
                  styles={{
                    root: {
                      fontSize: 24,
                      fontWeight: 400,
                      color:
                        lItem.ClientName == "Wells Fargo"
                          ? "#d71e2b"
                          : "#004FA2",
                      cursor: "pointer",
                    },
                  }}
                />
              </div>
            ),
          InternalForm: (
            <Icon
              iconName="FormLibrary"
              styles={{
                root: {
                  fontSize: 24,
                  fontWeight: 400,
                  cursor: "pointer",
                  color:
                    lItem.ClientName == "Wells Fargo" ? "#d71e2b" : "#004FA2",
                },
              }}
              onClick={() => {
                lItem.ClientName == "Wells Fargo"
                  ? (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/InternalForm.aspx?RequestType=WF&RequestId=${lItem.ID}`)
                  : (window.location.href = `https://chandrudemo.sharepoint.com/sites/LynxSpring/SitePages/InternalForm.aspx?RequestType=NWF&RequestId=${lItem.ID}`);
              }}
            />
          ),
          ProjectNo: !lItem.ProjectNo ? (
            <Icon
              id={`${lItem.ID}`}
              iconName="Edit"
              styles={{
                root: {
                  fontSize: 24,
                  fontWeight: 400,
                  cursor: "pointer",
                  color:
                    lItem.ClientName == "Wells Fargo" ? "#d71e2b" : "#004FA2",
                },
              }}
              onClick={(e) => {
                currID = e.target["id"];
                toggleHideDialog();
                lItem.ClientName == "Wells Fargo"
                  ? setIsWFItem(true)
                  : setIsWFItem(false);
              }}
            />
          ) : (
            lItem.ProjectNo
          ),
        };
      });
      setItems(constructedItems);
      setFetchList(false);
      paginate(1);
    }
  }, [fetchList]);
  const companyDropdownChangeHandler = (selectedItem) => {
    console.log(selectedItem);
    selectedItem.text != "All"
      ? setItems(
          constructedItems.filter(
            (item) => item.ClientName === selectedItem.text
          )
        )
      : setItems(constructedItems);
  };

  const columns: IColumn[] = [
    {
      key: "1",
      name: "Client Name",
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
      name: "Assigned To",
      fieldName: "AssignedTo",
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
      key: "4",
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
      key: "5",
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
      key: "6",
      name: "Status",
      fieldName: "Status",
      minWidth: 330,
      maxWidth: 350,
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
      key: "8",
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
      key: "9",
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
  function _onChange(
    ev: React.FormEvent<HTMLInputElement>,
    option: IChoiceGroupOption
  ): void {
    // console.dir(option);
    companyDropdownChangeHandler(option);
  }
  return (
    <div style={{ margin: "1rem 2rem" }}>
      <div className={styles.dashboardHeader}>
        <ChoiceGroup
          defaultSelectedKey="All"
          styles={{
            flexContainer: {
              display: "flex",
              label: {
                marginRight: "1rem",
              },
            },
          }}
          options={options}
          onChange={_onChange}
        />
        <SearchBox
          styles={searchBoxStyles}
          placeholder="Search"
          onChange={(_, newValue) =>
            setItems(
              newValue
                ? constructedItems.filter((item) =>
                    item.OrderNo.toLowerCase().includes(newValue.toLowerCase())
                  )
                : constructedItems
            )
          }
          onSearch={(newValue) => {
            setItems(
              constructedItems.filter((item) =>
                item.OrderNo.toLowerCase().includes(newValue.toLowerCase())
              )
            );
          }}
        />
      </div>
      {items.length > 0 ? (
        <>
          <Pagination
            style={{ margin: "auto" }}
            currentPage={currentpage}
            totalPages={
              constructedItems.length > 0
                ? Math.ceil(constructedItems.length / 30)
                : 1
            }
            onChange={(page) => {
              paginate(page);
            }}
          />
          <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.none}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
          />
        </>
      ) : (
        <div className={styles.noDataFound}>No data found</div>
      )}
      <ThemeProvider theme={isWFItem ? redTheme : blueTheme}>
        <Dialog
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
          modalProps={modelProps}
        >
          <TextField
            label="Project no:"
            value={ProjectNo}
            onChange={(e) => {
              let projNo = e.target["value"];
              setProjectNo(projNo);
            }}
          />
          <DialogFooter>
            <PrimaryButton
              onClick={() => {
                props.spcontext.web.lists
                  .getByTitle(
                    isWFItem ? "WFQuoteRequestList" : "NWFQuoteRequestList"
                  )
                  .items.getById(+currID)
                  .update({
                    ProjectNo: ProjectNo,
                  })
                  .then(() => {
                    allItems.filter((item) => item.ID == currID)[0].ProjectNo =
                      ProjectNo;
                    setFetchList(true);
                    toggleHideDialog();
                  })
                  .catch((error) => console.log(error));
              }}
              text="Submit"
            />
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </ThemeProvider>
    </div>
  );
  function paginate(pagenumber) {
    var lastIndex = pagenumber * totalPage;
    var firstIndex = lastIndex - totalPage;

    var paginatedItems = constructedItems.slice(firstIndex, lastIndex);

    currentpage = pagenumber;
    setItems([...paginatedItems]);
  }
};
export default App;
