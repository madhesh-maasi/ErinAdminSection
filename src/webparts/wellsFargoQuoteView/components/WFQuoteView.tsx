import * as React from "react";
import { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { TextField, MaskedTextField } from "@fluentui/react/lib/TextField";
import styles from "./WellsFargoQuoteView.module.scss";
import { DisplayMode } from "@microsoft/sp-core-library";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
import {
  DatePicker,
  DayOfWeek,
  Dropdown,
  IDropdownOption,
  mergeStyles,
  defaultDatePickerStrings,
  Checkbox,
  ThemeProvider,
} from "@fluentui/react";
import {
  ContextualMenu,
  IContextualMenuProps,
  IIconProps,
} from "@fluentui/react";
import { loadTheme, createTheme, Theme } from "@fluentui/react";
let formID = 0;
let MasterInstallationOptions;
const paramsString = window.location.href.split("?")[1].toLowerCase();
const searchParams = new URLSearchParams(paramsString);
searchParams.has("formid") ? (formID = Number(searchParams.get("formid"))) : "";

const fullWidthInput = {
  root: { width: "70%", marginBottom: "0.5rem" },
};
const halfWidthInput = {
  root: { width: "50%", margin: "0 1rem 0.5rem 0" },
};
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
let arrTemplateMaster = [];
let arrTemplateSelected = [];
let arrInstall = [
  {
    id: 100000,
    manufacture: "LynxSpring",
    modelNo: "",
    serialNo: "",
    quantity: "",
    eachPrice: "",
    eachMarkup: "",
    totalProduct: "",
    taxable: false,
    people: "",
    hoursPerPerson: "",
    hourlyBillingRate: "",
    unionRate: false,
    totalLabour: "",
    labourTaxable: false,
    grandTotalProduct: "",
    templateOf: "",
  },
];
let objProjInfo = {
  projNoInput: "",
  projManagerInput: "",
  BENoInput: "",
  ProjNameInput: "",
  DeliveryAddInput: "",
  projAreaInput: "",
  EstimateStartDateInput: new Date(),
  EstimateEndDateInput: new Date(),
};
let objVendorInfo = {
  companyNameInput: "",
  wfVendorNoInput: "",
  remitAddInput: "",
  proposalNoInput: "",
  cityStateZipInput: "",
  wfContractNoInput: "",
  contactNameInput: "",
  changeOrderInput: "",
  phoneNoInput: "",
  changeOrderPOInput: "",
  cellInput: "",
  emailIdInput: "",
};
let objTaxes = {
  Product: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  Labour: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  ProductSubTotal: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  DemoProduct: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  DemoLabour: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  DemoSubTotal: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  Freight: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  SpringHandling: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  ProfitOH: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  Insurance: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
  Total: {
    PreTax: "",
    Tax: "",
    Total: "",
  },
};
const WFQuoteView = (props) => {
  const [projectInfo, setProjectInfo] = useState(objProjInfo);
  const [vendorInfo, setVendorInfo] = useState(objVendorInfo);
  const [orderNo, setOrderNo] = useState("");
  const [installationtable, setInstallationTable] = useState([]);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [taxesInfo, setTaxesInfo] = useState(objTaxes);
  const [templateOptions, setTemplateOptions] = useState([]);
  useEffect(() => {
    props.spcontext.web.lists
      .getByTitle("WFQuoteRequestList")
      .items.select("*")
      .getById(formID)
      .get()
      .then((li) => {
        console.log(li);
        objProjInfo = {
          projNoInput: li.OrderNo,
          projManagerInput: li.ManagerName,
          BENoInput: li.BENumber,
          ProjNameInput: li.Title,
          DeliveryAddInput: li.ShippingAddress,
          projAreaInput: li.ProjectArea,
          EstimateStartDateInput: new Date(li.StartDate),
          EstimateEndDateInput: new Date(li.EndDate),
        };
        objVendorInfo = {
          companyNameInput: li.companyName,
          wfVendorNoInput: li.wfVendorNo,
          remitAddInput: li.remitToAddress,
          proposalNoInput: li.proposalNo,
          cityStateZipInput: li.cityStateZip,
          wfContractNoInput: li.wfContractNo,
          contactNameInput: li.contactName,
          changeOrderInput: li.changeOrder,
          phoneNoInput: li.phoneNo,
          changeOrderPOInput: li.changeOrderPO,
          cellInput: li.cell,
          emailIdInput: li.emailID,
        };
        setProjectInfo(objProjInfo);
        setVendorInfo(objVendorInfo);
        arrInstall = JSON.parse(li.installationDetails);
        setInstallationTable(arrInstall);
        li.taxesInfo
          ? setTaxesInfo(JSON.parse(li.taxesInfo))
          : setTaxesInfo(objTaxes);
        setOrderNo(li.OrderNo);
      })
      .then(() => {
        props.spcontext.web.lists
          .getByTitle("InstallationTemplates")
          .items.select("*")
          .get()
          .then((installationDetails) => {
            let masterOptions = installationDetails.map((installItem) => {
              return installItem.templateOf;
            });
            MasterInstallationOptions = masterOptions
              .filter((c, index) => {
                return masterOptions.indexOf(c) === index;
              })
              .map((option) => {
                return { key: option, text: option };
              });
            setTemplateOptions(MasterInstallationOptions);
          });
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <ThemeProvider
      theme={redTheme}
      style={{ backgroundColor: "#F2F2F2", padding: "1rem" }}
    >
      <div className={styles.formHeader}>
        <Icon
          iconName="NavigateBack"
          styles={{
            root: {
              fontSize: 30,
              fontWeight: 600,
              color: "#D71E2B",
              marginRight: "1rem",
            },
          }}
          onClick={() => {
            history.back();
          }}
        />
        <div style={{ fontWeight: "bold" }}>Order No: {orderNo}</div>
      </div>
      <h1 className={styles.heading}>Quote Form</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <PrimaryButton text="Export Doc" style={{ marginRight: "1rem" }} />
        <PrimaryButton text="Export Excel" />
      </div>
      <div className={styles.quoteFormSectionOne}>
        <div className={styles.sectionOneSub} style={{ marginRight: "0.3rem" }}>
          <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
            PROJECT / INFROMATION (Information provided by Wells Fargo)
          </h3>
          <TextField
            label="Project No or Wor Order No"
            styles={fullWidthInput}
            value={projectInfo.projNoInput}
            disabled={true}
          />
          <TextField
            label="WF Project/Property Manager"
            styles={fullWidthInput}
            value={projectInfo.projManagerInput}
            disabled={true}
          />
          <TextField
            label="BE Number"
            styles={fullWidthInput}
            value={projectInfo.BENoInput}
            disabled={true}
          />
          <TextField
            label="Building / Project Name"
            styles={fullWidthInput}
            value={projectInfo.ProjNameInput}
            disabled={true}
          />
          <TextField
            label="BE Service or Delivery Address"
            styles={fullWidthInput}
            value={projectInfo.DeliveryAddInput}
            disabled={true}
          />
          <TextField
            label="Project Area (sq.ft)"
            styles={fullWidthInput}
            value={projectInfo.projAreaInput}
            disabled={true}
          />
          <div style={{ display: "flex" }}>
            <DatePicker
              label="Estimate Start Date"
              firstDayOfWeek={firstDayOfWeek}
              placeholder="Select a date..."
              ariaLabel="Select a date"
              value={objProjInfo.EstimateEndDateInput}
              // DatePicker uses English strings by default. For localized apps, you must override this prop.
              strings={defaultDatePickerStrings}
              styles={halfWidthInput}
              disabled={true}
            />
            <DatePicker
              label="Estimate End Date"
              firstDayOfWeek={firstDayOfWeek}
              placeholder="Select a date..."
              ariaLabel="Select a date"
              // DatePicker uses English strings by default. For localized apps, you must override this prop.
              strings={defaultDatePickerStrings}
              styles={halfWidthInput}
              disabled={true}
              value={objProjInfo.EstimateEndDateInput}
            />
          </div>
        </div>

        <div className={styles.sectionOneSub} style={{ marginLeft: "0.3rem" }}>
          <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
            VENDOR'S AUTHORIZED REPRESENTATIVE
          </h3>
          <div style={{ display: "flex" }}>
            <TextField
              label="Company Name"
              styles={halfWidthInput}
              value={vendorInfo.companyNameInput}
              disabled={true}
            />
            <TextField
              label="WF Vendor No"
              styles={halfWidthInput}
              value={vendorInfo.wfVendorNoInput}
              disabled={true}
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="Remit to Address"
              styles={halfWidthInput}
              value={vendorInfo.remitAddInput}
              disabled={true}
            />
            <TextField
              label="Proposal No"
              styles={halfWidthInput}
              value={vendorInfo.proposalNoInput}
              disabled={true}
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="City,State,Zip"
              styles={halfWidthInput}
              value={vendorInfo.cityStateZipInput}
              disabled={true}
            />
            <TextField
              label="WF Contract Number"
              styles={halfWidthInput}
              value={vendorInfo.wfContractNoInput}
              disabled={true}
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="Contact Name"
              styles={halfWidthInput}
              value={vendorInfo.contactNameInput}
              disabled={true}
            />
            <TextField
              label="Change Order"
              styles={halfWidthInput}
              value={vendorInfo.changeOrderInput}
              disabled={true}
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="Phone Number"
              styles={halfWidthInput}
              value={vendorInfo.phoneNoInput}
              disabled={true}
            />
            <TextField
              label="Change Order Previous PO#"
              styles={halfWidthInput}
              value={vendorInfo.changeOrderPOInput}
              disabled={true}
            />
          </div>
          <div style={{ display: "flex" }}>
            <TextField
              label="Cell"
              styles={halfWidthInput}
              value={vendorInfo.cellInput}
              disabled={true}
            />
            <TextField
              label="Email ID"
              styles={halfWidthInput}
              value={vendorInfo.emailIdInput}
              disabled={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.quoteFormSection}>
        <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
          Scope Of Work
        </h3>
        <p>
          Detail Needed- Be as descriptive as possible and if there are
          multiples of items please specify how many. Details and numbers of
          units help fixed assets determine asset value and will help eliminate
          questions and the need to resubmit proposals or invoices.{" "}
        </p>
      </div>
      <div className={styles.quoteFormSection}>
        <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
          Installation
        </h3>
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Dropdown
            options={templateOptions}
            disabled={true}
            placeholder="Select a template"
            styles={{ root: { width: 200, margin: "0 2rem 0 auto" } }}
          />
        </div> */}
        <table className={styles.installationTbl}>
          <thead>
            <tr>
              <th>Manufacturer</th>
              <th>Model#</th>
              <th>Serial#</th>
              <th>Quantity</th>
              <th>Each Price</th>
              <th>Each Markup</th>
              <th>Total Product</th>
              <th>Taxable Y/N</th>
              <th>People#</th>
              <th>Hours per person</th>
              <th>Hourly Billing Rate</th>
              <th>Union rate Y/N</th>
              <th>Total Labour</th>
              <th>Labour taxable?(Y/N)</th>
              <th>Total Products</th>
            </tr>
          </thead>
          <tbody>
            {installationtable && installationtable.length > 0
              ? installationtable.map((installItem, i) => {
                  return (
                    <tr>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.manufacture}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.modelNo}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.serialNo}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.quantity}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.eachPrice}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.eachMarkup}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.totalProduct}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Checkbox
                          checked={installItem.taxable ? true : false}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.people}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.hoursPerPerson}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.hourlyBillingRate}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Checkbox
                          checked={installItem.unionRate ? true : false}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.totalLabour}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <Checkbox
                          checked={installItem.labourTaxable ? true : false}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField
                          key={i}
                          value={installItem.grandTotalProduct}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  );
                })
              : ""}
            <tr>
              <td colSpan={7}>
                <TextField disabled={true} />
              </td>

              <td colSpan={2}>
                <TextField disabled={true} />
              </td>
              <td>
                <TextField disabled={true} />
              </td>

              <td colSpan={5}>
                <TextField disabled={true} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        className={styles.quoteFormSection}
        style={{ opacity: 0.5, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            zIndex: 100,
          }}
        ></div>
        <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
          Demo / Removal / Patching / Repairs / Relo
        </h3>
        <table className={styles.installationTbl}>
          <thead>
            <tr>
              <th>Include costs of demolition and demolition labor.</th>
              <th>Quantity</th>
              <th>Price Each</th>
              <th>Total Demo</th>
              <th>Taxable? (Y/N)</th>
              <th>People #</th>
              <th>Hours Per Person #</th>
              <th>Hourly Bill rate #</th>
              <th>Union Rate Y/N</th>
              <th>Total Labour</th>
              <th>Labour taxable?(Y/N)</th>
              <th>Total Products</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {" "}
                <TextField value="Lynx Spring" />
              </td>
              <td>
                <TextField
                  styles={{
                    root: {
                      width: 30,
                      margin: "auto",
                    },
                  }}
                />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
              <td>
                <TextField />
              </td>
            </tr>
          </tbody>
        </table>
        <div className={styles.totalSection}>
          <TextField />
          <TextField />
          <TextField />
          <TextField />
        </div>
      </div>
      <div className={styles.quoteFormSection}>
        <h3 className={styles.heading} style={{ margin: "0 0 0.5rem 0" }}>
          Assumptions and clarifications
        </h3>
        <p>
          Clarify assumptions, clarifications, and exclusions in this space.
        </p>
      </div>
      <div className={styles.taxSection}>
        <table className={styles.taxTable}>
          <thead>
            <tr>
              <th></th>
              <th>Pre-Tax</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Product</td>
              <td>
                <TextField value={taxesInfo.Product.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Product.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Product.Total} disabled={true} />
              </td>
            </tr>
            <tr>
              <td>Labour</td>
              <td>
                <TextField value={taxesInfo.Labour.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Labour.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Labour.Total} disabled={true} />
              </td>
            </tr>
            <tr style={{ backgroundColor: "#fdefeb" }}>
              <td>Sub Total</td>
              <td>
                <TextField
                  value={taxesInfo.ProductSubTotal.PreTax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField
                  value={taxesInfo.ProductSubTotal.Tax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField
                  value={taxesInfo.ProductSubTotal.Total}
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <td>Demo Product</td>
              <td>
                <TextField
                  value={taxesInfo.DemoProduct.PreTax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField value={taxesInfo.DemoProduct.Tax} disabled={true} />
              </td>
              <td>
                <TextField
                  value={taxesInfo.DemoProduct.Total}
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <td>Demo Labour</td>
              <td>
                <TextField
                  value={taxesInfo.DemoLabour.PreTax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField value={taxesInfo.DemoLabour.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.DemoLabour.Total} disabled={true} />
              </td>
            </tr>
            <tr style={{ backgroundColor: "#fdefeb" }}>
              <td>Sub Total</td>
              <td>
                <TextField
                  value={taxesInfo.DemoSubTotal.PreTax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField value={taxesInfo.DemoSubTotal.Tax} disabled={true} />
              </td>
              <td>
                <TextField
                  value={taxesInfo.DemoSubTotal.Total}
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <td>Freight</td>
              <td>
                <TextField value={taxesInfo.Freight.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Freight.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Freight.Total} disabled={true} />
              </td>
            </tr>
            <tr>
              <td>Spring Handling</td>
              <td>
                <TextField
                  value={taxesInfo.SpringHandling.PreTax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField
                  value={taxesInfo.SpringHandling.Tax}
                  disabled={true}
                />
              </td>
              <td>
                <TextField
                  value={taxesInfo.SpringHandling.Total}
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <td>Profit & OH</td>
              <td>
                <TextField value={taxesInfo.ProfitOH.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.ProfitOH.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.ProfitOH.Total} disabled={true} />
              </td>
            </tr>
            <tr>
              <td>Insurance</td>
              <td>
                <TextField value={taxesInfo.Insurance.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Insurance.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Insurance.Total} disabled={true} />
              </td>
            </tr>
            <tr style={{ backgroundColor: "#fdefeb" }}>
              <td>Total</td>
              <td>
                <TextField value={taxesInfo.Total.PreTax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Total.Tax} disabled={true} />
              </td>
              <td>
                <TextField value={taxesInfo.Total.Total} disabled={true} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.SubmitSection}>
        <DefaultButton
          text="Back"
          onClick={() => {
            history.back();
          }}
        />
      </div>
    </ThemeProvider>
  );
};
export default WFQuoteView;
