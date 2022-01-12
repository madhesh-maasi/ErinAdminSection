import * as React from "react";
import styles from "./NonWellsFargoQuoteView.module.scss";
import {
  loadTheme,
  createTheme,
  Theme,
  DayOfWeek,
  IChoiceGroupOption,
  PivotItem,
  Checkbox,
  Icon,
  ChoiceGroup,
  DatePicker,
  DefaultButton,
  Pivot,
  PrimaryButton,
  TextField,
  ThemeProvider,
} from "@fluentui/react";
import { useEffect, useState } from "react";

let formID = 0;
const paramsString = window.location.href.split("?")[1].toLowerCase();
const searchParams = new URLSearchParams(paramsString);
searchParams.has("formid") ? (formID = Number(searchParams.get("formid"))) : "";

let arrnwParts = [
  {
    isSelected: false,
    PartNo: "",
    PartName: "",
    PartDescription: "",
    ListPrice: 0,
    itemFor: "",
    NetPrice: 0,
    Note: "",
    PartDescriptionSort: "",
    id: 0,
  },
];
let arrMilestones = [];
let objValues = {
  ProjectNo: "",
  Date: new Date(),
  ConsultantName: "",
  ConsultantCity: "",
  ConsultantContactNo: "",
  ConsultantPinCode: "",
  ConsultantAddress: "",
  ClientName: "",
  ClientCity: "",
  ClientContactNo: "",
  ClientPinCode: "",
  ClientAddress: "",
  SentVai: "",
  ProjectDescription: "",
  TypesOfProposal: "",
  Multiplier: "",
  ProposedBy: "",
  ProposedName: "",
  ProposedTitle: "",
  ProposedDate: new Date(),
  AcceptedBy: "",
  AcceptedByName: "",
  AcceptedByDate: new Date(),
  AcceptedByTitle: "",
  StatementOfWork: "",
  Services: "",
};
let objSelectedServices = {
  JENEsysEDGE: [],
  ONYXX: [],
  ONYXXLX: [],
  Niagara4: [],
  HardwareAccessories: [],
  JENEsysEngineeringTools: [],
  JENEsysEnclosures: [],
  Renewals: [],
  JENEsysThermostatsPeripherals: [],
  BACnetControllers: [],
  Distech: [],
  Veris: [],
  Belimo: [],
  TemperatureRHCO2Sensors: [],
  PowerMeters: [],
  DifferentialPressureTransmittersSwitches: [],
  Relays: [],
  CurrentSensorsTransmitters: [],
  PowerSupplies: [],
  Transformers: [],
  LynxspringUniversity: [],
  TAPA: [],
  DGLux: [],
  SkyFoundry: [],
  TridiumAnalytics: [],
};
const myTheme = createTheme({
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
loadTheme(myTheme);
let arrSentViaOptions = [];
let arrTypesOfProposal = [];
const NWFQuoteView = (props) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedKey, setSelectedKey] = useState(1);
  const [milestones, setMilestones] = useState(arrMilestones);
  const [fetchTable, setFetchTable] = useState(true);
  const [partsDetails, setPartsDetails] = useState(arrnwParts);
  const [fetchPartsTable, setFetchPartsTable] = useState(true);
  const [objToPost, setObjToPost] = useState(objValues);
  const [renderObjValue, setRenderObjValue] = useState(true);
  const [selectedServices, setSelectedServices] = useState(objSelectedServices);
  const [fetchSelectedServices, setFetchSelectedServices] = useState(true);
  const [sentViaOptions, setSentViaOptions] = useState(arrSentViaOptions);
  const [typesOfProposalOptions, setTypesOfProposalOptions] =
    useState(arrTypesOfProposal);

  const halfWidthInput = {
    root: { width: 300, margin: "0 1rem 0.5rem 0" },
  };
  useEffect(() => {
    props.spcontext.web.lists
      .getByTitle("NWFQuoteRequestList")
      .fields.filter("EntityPropertyName eq 'SentVia'")
      .get()
      .then((SentVia) => {
        SentVia[0].Choices.forEach((option) => {
          arrSentViaOptions.push({
            key: option,
            text: option,
          });
        });
      });
    setSentViaOptions(arrSentViaOptions);
    props.spcontext.web.lists
      .getByTitle("NWFQuoteRequestList")
      .fields.filter("EntityPropertyName eq 'TypesOfProposal'")
      .get()
      .then((types) => {
        types[0].Choices.forEach((option) => {
          arrTypesOfProposal.push({
            key: option,
            text: option,
          });
        });
        setTypesOfProposalOptions(arrTypesOfProposal);
      });
    props.spcontext.web.lists
      .getByTitle("NWFQuoteRequestList")
      .items.getById(formID)
      .get()
      .then((li: any) => {
        objValues = {
          ProjectNo: li.ProjectNo,
          Date: new Date(li.Date),
          ConsultantName: li.ConsultantName,
          ConsultantCity: li.ConsultantCity,
          ConsultantContactNo: li.ConsultantContactNo,
          ConsultantPinCode: li.ConsultantPinCode,
          ConsultantAddress: li.ConsultantAddress,
          ClientName: li.ClientName,
          ClientCity: li.ClientCity,
          ClientContactNo: li.ClientContactNo,
          ClientPinCode: li.ClientPinCode,
          ClientAddress: li.ClientAddress,
          SentVai: li.SentVia,
          ProjectDescription: li.ProjectDescription,
          TypesOfProposal: li.TypesOfProposal,
          Multiplier: li.Multiplier,
          ProposedBy: li.ProposedBy,
          ProposedName: li.ProposedName,
          ProposedTitle: li.ProposedTitle,
          ProposedDate: new Date(li.ProposedDate),
          AcceptedBy: li.AcceptedBy,
          AcceptedByName: li.AcceptedByName,
          AcceptedByDate: new Date(li.AcceptedByDate),
          AcceptedByTitle: li.AcceptedByTitle,
          StatementOfWork: li.StatementOfWork,
          Services: li.Services,
        };
        console.log(li);
        arrnwParts =
          li.ProposedServicesFees == ""
            ? []
            : JSON.parse(li.ProposedServicesFees);
        console.log(JSON.parse(li.ProposedServicesFees));

        arrMilestones = JSON.parse(li.Milestones);
        setRenderObjValue(true);
        setFetchPartsTable(true);
        setFetchTable(true);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    if (fetchTable) {
      setMilestones([...arrMilestones]);
      setFetchTable(false);
    }
  }, [fetchTable]);
  useEffect(() => {
    if (fetchPartsTable) {
      arrnwParts && arrnwParts.length > 0
        ? setPartsDetails([...arrnwParts])
        : "";
      setFetchPartsTable(false);
    }
  }, [fetchPartsTable]);
  useEffect(() => {
    if (fetchSelectedServices) {
      setSelectedServices(objSelectedServices);
      setFetchSelectedServices(false);
    }
  }, [fetchSelectedServices]);
  useEffect(() => {
    if (renderObjValue) {
      setObjToPost(objValues);
      setRenderObjValue(false);
    }
  }, [renderObjValue]);
  return (
    <div style={{ backgroundColor: "#F2F2F2", padding: "1rem 2rem" }}>
      <div className={styles.formHeader}>
        <Icon
          iconName="NavigateBack"
          styles={{
            root: {
              fontSize: 30,
              fontWeight: 600,
              color: myTheme.palette.themePrimary,
              marginRight: "1rem",
              cursor: "pointer",
            },
          }}
          onClick={() => {
            history.back();
          }}
        />
        <h2
          style={{
            textAlign: "center",
            color: myTheme.palette.themePrimary,
            width: "100%",
          }}
        >
          Proposal of Services
        </h2>
      </div>
      <div className={`${styles.projectDetails} ${styles.section}`}>
        <TextField
          label="Project No"
          styles={halfWidthInput}
          value={objToPost.ProjectNo}
          disabled={true}
        />
        <DatePicker
          styles={halfWidthInput}
          label="Date"
          firstDayOfWeek={firstDayOfWeek}
          placeholder="Select a date..."
          ariaLabel="Select a date"
          disabled={true}
          value={objToPost.Date}
        />
      </div>
      {/* Section */}
      <div className={styles.section}>
        {/* Consultant Section */}
        <h3 style={{ color: myTheme.palette.themePrimary }}>
          Form (Consultant)
        </h3>
        <div className={styles.consultantClient}>
          <div>
            <TextField
              label="Name"
              styles={halfWidthInput}
              value={objToPost.ConsultantName}
              disabled={true}
            />
            <TextField
              label="Contact No"
              styles={halfWidthInput}
              value={objToPost.ConsultantContactNo}
              disabled={true}
            />
          </div>
          <div>
            <TextField
              label="City"
              styles={halfWidthInput}
              value={objToPost.ConsultantCity}
              disabled={true}
            />
            <TextField
              label="Pin Code"
              styles={halfWidthInput}
              value={objToPost.ClientPinCode}
              disabled={true}
            />
          </div>
          <div>
            <TextField
              styles={halfWidthInput}
              label="Address"
              multiline
              resizable={false}
              value={objToPost.ConsultantAddress}
              disabled={true}
            />
          </div>
        </div>
        {/* Client Section */}
        <h3 style={{ color: myTheme.palette.themePrimary }}>To (Client)</h3>
        <div className={styles.consultantClient}>
          <div>
            <TextField
              label="Name"
              styles={halfWidthInput}
              value={objToPost.ClientName}
              disabled={true}
            />
            <TextField
              label="Contact No"
              styles={halfWidthInput}
              value={objToPost.ClientContactNo}
              disabled={true}
            />
          </div>
          <div>
            <TextField
              label="City"
              styles={halfWidthInput}
              value={objToPost.ClientCity}
              disabled={true}
            />
            <TextField
              label="Pin Code"
              styles={halfWidthInput}
              value={objToPost.ClientPinCode}
              disabled={true}
            />
          </div>
          <div>
            <TextField
              styles={halfWidthInput}
              label="Address"
              multiline
              resizable={false}
              value={objToPost.ClientAddress}
              disabled={true}
            />
          </div>
        </div>
      </div>
      {/* Section */}
      {/* Section */}
      <div className={styles.section}>
        <div>
          <ChoiceGroup
            options={sentViaOptions}
            label="Sent Via:"
            disabled={true}
            selectedKey={objToPost.SentVai}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            styles={halfWidthInput}
            label="Services"
            multiline
            resizable={false}
            value={objValues.Services}
            disabled={true}
          />
          <TextField
            styles={halfWidthInput}
            label="Project Description"
            multiline
            resizable={false}
            value={objValues.ProjectDescription}
            disabled={true}
          />
        </div>
        <div>
          <ChoiceGroup
            options={typesOfProposalOptions}
            label="Types of proposal"
            disabled={true}
            selectedKey={objToPost.TypesOfProposal}
          />
        </div>
      </div>
      {/* Section */}
      <div className={`${styles.section} ${styles.sectionPovit}`}>
        {/*  Pivot Section Start */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: myTheme.palette.themePrimary }}>
            Proposed Services and Fee
          </h3>
          <TextField
            type="number"
            value={objValues.Multiplier}
            styles={{
              root: {
                width: 100,
              },
            }}
            label="Your Multiplier"
            disabled={true}
          />
        </div>
        {/* Pivot */}
        <ThemeProvider dir="ltr">
          {partsDetails ? (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Part Name</th>
                  <th>Part Description</th>
                  <th>List Price</th>
                  <th>Net Price</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {partsDetails.map((part) => {
                  if (part.isSelected) {
                    return (
                      <tr
                        style={{
                          backgroundColor: part.isSelected
                            ? "#eef4fa"
                            : "#ffffff",
                        }}
                      >
                        <td>
                          {" "}
                          <Checkbox checked={part.isSelected ? true : false} />
                        </td>
                        <td>
                          <div>{part.PartNo}</div>
                          <div>{part.PartName}</div>
                        </td>
                        <td>
                          <label title={part.PartDescription}>
                            {part.PartDescriptionSort}
                          </label>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {part.ListPrice}
                        </td>
                        <td style={{ textAlign: "center" }}>{part.NetPrice}</td>
                        <td>{part.Note}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          ) : (
            ""
          )}
        </ThemeProvider>
        {/* Pivot */}
        {/*  Pivot Section End */}
      </div>
      {/* Section */}
      <div className={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ color: myTheme.palette.themePrimary }}>
              Proposed for Consultant: Lynxspring, Inc
            </h3>
            <TextField
              styles={halfWidthInput}
              label="By"
              value={objValues.ProposedBy}
              disabled={true}
            />
            <TextField
              styles={halfWidthInput}
              label="Name (Printed)"
              value={objValues.ProposedName}
              disabled={true}
            />
            <TextField
              styles={halfWidthInput}
              label="Title"
              value={objValues.ProposedTitle}
              disabled={true}
            />
            <DatePicker styles={halfWidthInput} label="Date" disabled={true} />
          </div>
          <div>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ color: myTheme.palette.themePrimary }}>
                  Accepted for Client:
                </h3>
                <TextField
                  styles={halfWidthInput}
                  placeholder="Client Name"
                  disabled={true}
                />
              </div>
              <TextField
                styles={halfWidthInput}
                label="By"
                value={objValues.AcceptedBy}
                disabled={true}
              />
              <TextField
                styles={halfWidthInput}
                label="Name (Printed)"
                value={objValues.AcceptedByName}
                disabled={true}
              />
              <TextField
                styles={halfWidthInput}
                label="Title"
                value={objValues.AcceptedByTitle}
                disabled={true}
              />
              <DatePicker
                styles={halfWidthInput}
                label="Date"
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Section */}
      <div className={styles.section}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h3
            style={{ textAlign: "center", color: myTheme.palette.themePrimary }}
          >
            LYNXSPRING Schedules of Invoice and Statement of work
          </h3>
          <TextField
            styles={halfWidthInput}
            label="Satement of work:"
            value={objValues.StatementOfWork}
            disabled={true}
          />
        </div>
        {/* Milestone Section */}
        <table className={styles.mileStoneTable}>
          <thead>
            <tr>
              <th></th>
              <th>Description of Deliverables</th>
              <th>Estimated Start and End Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone) => {
              return (
                <tr>
                  <td>{milestone.title}</td>
                  <td>
                    <TextField
                      key={milestone.id}
                      id={`${milestone.id}`}
                      styles={halfWidthInput}
                      value={milestone.description}
                      disabled={true}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DatePicker
                        key={milestone.id}
                        id={`${milestone.id}`}
                        styles={{ root: { width: 100 } }}
                        firstDayOfWeek={firstDayOfWeek}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        disabled={true}
                        // value={milestone.startDate}
                      />
                      -
                      <DatePicker
                        styles={{ root: { width: 100 } }}
                        firstDayOfWeek={firstDayOfWeek}
                        placeholder="Select a date..."
                        ariaLabel="Select a date"
                        key={milestone.id}
                        id={`${milestone.id}`}
                        disabled={true}
                        // value={milestone.endDate}
                      />
                    </div>
                  </td>
                  <td>
                    <TextField
                      styles={halfWidthInput}
                      value={milestone.amount}
                      key={milestone.id}
                      id={`${milestone.id}`}
                      disabled={true}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Milestone Section */}
        <div className={styles.submitSection}>
          <DefaultButton text="Cancel" onClick={() => history.back()} />
        </div>
      </div>

      {/* Section */}
    </div>
  );
};
export default NWFQuoteView;
