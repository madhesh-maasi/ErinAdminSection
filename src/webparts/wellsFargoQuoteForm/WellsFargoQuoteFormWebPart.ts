import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "WellsFargoQuoteFormWebPartStrings";
import WellsFargoQuoteForm from "./components/WellsFargoQuoteForm";
import { IWellsFargoQuoteFormProps } from "./components/IWellsFargoQuoteFormProps";

export interface IWellsFargoQuoteFormWebPartProps {
  description: string;
}

export default class WellsFargoQuoteFormWebPart extends BaseClientSideWebPart<IWellsFargoQuoteFormWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IWellsFargoQuoteFormProps> =
      React.createElement(WellsFargoQuoteForm, {
        description: this.properties.description,
        context: this.context,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
