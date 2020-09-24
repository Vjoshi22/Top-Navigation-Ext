import * as React from "react";
import * as ReactDom from "react-dom";
import { override } from "@microsoft/decorators";
import { Log } from "@microsoft/sp-core-library";
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from "@microsoft/sp-application-base";
import { Dialog } from "@microsoft/sp-dialog";
import * as $ from "jquery";

import * as strings from "SpExtApplicationCustomizerStrings";

//eternal imports
import { GlobalNav } from "../spExt/Components/GlobalNav_html";
import globalNavTop from "./Components/GlobalNavtop";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
//import { INavListMainMenu } from "./Components/model/INavListMainMenu";
import { SPComponentLoader } from "@microsoft/sp-loader";

SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);
SPComponentLoader.loadScript(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
);
SPComponentLoader.loadCss(
  "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
);

require("../spExt/Components/CustomCss.scss");
//import GlobalNav from '../GlobalNav';

const LOG_SOURCE: string = "SpExtApplicationCustomizer";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */

export var listItems: any = [];
export var topMenu_arr: any =[];
export var Parent_arr: any=[];
export var listItemsSubMenu: any = [];
var _Count: number = 0;
var _runFun: number = 0;
var navbarCreatedVar: boolean = false;
var urlmainMenu = `/_api/web/lists/GetByTitle('SubItemMenu')/items?$expand=Parent&$select=Parent,Parent/Title`;
var urlsubMenu = `/_api/web/lists/GetByTitle('SubItemMenu')/items?$expand=Parent&$select=*,Parent/Title`;

export interface ISPList {
  Parent: string;
  Title: string;
  ID: number;
  SubMenuItem: string;
  iconsHTML: string;
  NavigationLink: string;
}
export interface ISpExtApplicationCustomizerProperties {
  cssurl: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpExtApplicationCustomizer extends BaseApplicationCustomizer<
  ISpExtApplicationCustomizerProperties
> {
  private topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    const cssUrl: string = this.properties.cssurl;
    if (cssUrl) {
      // inject the style sheet
      const head: any =
        document.getElementsByTagName("head")[0] || document.documentElement;
      let customStyle: HTMLLinkElement = document.createElement("link");
      customStyle.href = cssUrl;
      customStyle.rel = "stylesheet";
      customStyle.type = "text/css";
      head.insertAdjacentElement("beforeEnd", customStyle);
    }

    //fetch all list items GlobalNavList
    this.getlistItems(urlmainMenu).then((lists) => {
      console.log(lists);
      lists.forEach((list) => {
        listItems.push({
          "Parent": list.Parent
        });
      });
      listItems.forEach((item) =>{
        topMenu_arr.push({
          "Title": item.Parent.Title
        });
      });
      Parent_arr =  topMenu_arr.map((e) => {return e.Title});
      Parent_arr = Parent_arr.filter( function(v,i){return Parent_arr.indexOf(v) == i})
      console.log(Parent_arr);
      
      this.context.placeholderProvider.changedEvent.add(
        this,
        this.renderPlaceHolders
      );
    });

    //fetch all list items SubItemMenu for Sub Menu
    if(_runFun == 0){
    this.getlistItems(urlsubMenu).then((lists) => {
      console.log(lists);
      lists.forEach((list) => {
        listItemsSubMenu.push({
          ID: list.ID,
          Parent: list.Parent,
          SubMenu: list.SubMenuItem,
          iconsHTML: list.iconsHTML,
          navigationLinks: list.NavigationLink
        });
      });
    });
    _runFun++;
  }

    return Promise.resolve();
  }

  private renderPlaceHolders(): void {
    if (!this.topPlaceholder) {
      this.topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top
      );

      if (!this.topPlaceholder) {
        return;
      }

      if (this.topPlaceholder.domElement && navbarCreatedVar==false) {
        debugger;
        this.topPlaceholder.domElement.innerHTML = `
          <div id="mainMenu">
            <nav id="topNavBar" class="navbar navbar-expand-sm">
             <!-- Brand -->
               <a class="navbar-brand" href="#">PMO Site</a>
               <!-- Links -->
              <ul class="navbar-nav" id="UL_mainMenu">
              </ul>
            </nav>
          </div>
          <!--Sub-Menu -->
          <div id="subMenu">
            <nav id="SubNavBar" class="navbar navbar-expand-sm">
               <!-- Links -->
              <ul class="navbar-nav" id="UL_subMenu">
              </ul>
            </nav>
          </div>`;
        navbarCreatedVar = true;
        // const element: React.ReactElement<{}> = React.createElement(
        //   globalNavTop,
        //   {}
        // );
        // ReactDom.render(element, this.topPlaceholder.domElement);
      }
    }
    $(document).ready(function () {

      //testing
      
      //testing
      //append the list tag in the navbar
      if (navbarCreatedVar && _Count==0) {
        for (let i = 0; i < Parent_arr.length; i++) {
          $("#mainMenu .navbar-nav").append(
            `
            <li class="nav-item" id=id_` +
              Parent_arr[i] +
              `>
              <a class="nav-link" href="/sites/PMO/SitePages/Home.aspx">` +
              Parent_arr[i] +
              `</a>
            </li>
            `
          );
          
          //getSubMenuItems(listItems[i].Parent.Title); //appending all the submenus
        }
        _Count++;
      }

      //Custom Styles
      //$(".navbar").css("background-color", "#3c5399");
      //$("#SubNavBar").css("background-color", "seashell");
      $(".navbar-brand").css("color", "white");
      //$(".nav-link").css("color", "white");
      $("#UL_subMenu").css("margin", "0 auto");
      $("#UL_subMenu .nav-link").css("color", "black");
      $("#subMenu").hide();
      //change color of the menu on hover
      // $(".nav-link").on({
      //   mouseenter: function () {
      //     $(this).css({
      //       "background": "#a0d9f4",
      //       "color": "#000",
      //       "cursor": "pointer"
      //   });
      //   },
      //   mouseleave: function () {
      //     $(this).css({
      //       "background": "#3c5399",
      //       "color": "white"
      //   });
      //   },
      // }); //on hover end

      $(".nav-item").on({
        mouseenter: function () {
          if ($("#UL_mainMenu li").hasClass("active")) {
            $("#UL_mainMenu li").removeClass("active"); //removing all previous active class when changing menu item
          }
          $(this).toggleClass("active"); //toggle class to show acitve top menu item
        },
        // mouseleave: function(){
        //   $(this).toggleClass('active');
        // }
      });

      //onhover show the submenu items
      $(".nav-item").on({
        mouseover: function () {
          $("#UL_subMenu li").hide();
          if (!$("#UL_subMenu li").hasClass(this.innerText)) {
            getSubMenuItems(this.innerText);
          } else {
            $("." + this.innerText).show();
            $("#SubNavBar").fadeIn(1500);
            $("#subMenu").fadeIn(1500);
            //$("#subMenu").show();
          }
          showSubMenu_onhover(this);
        },
        // mouseout: function () {

        // //   $("." + this.innerText).hide();
        // //   $("#subMenu").hide();
        // }
      });

      //function to load Sub Menu Items
      function getSubMenuItems(currentMenu) {
        for (let i = 0; i < listItemsSubMenu.length; i++) {
          if (currentMenu == listItemsSubMenu[i].Parent.Title) {
            $("#subMenu .navbar-nav").append(
              `
                <li class="nav-item ` +
                currentMenu +
                `" for=id_` +
                listItemsSubMenu[i].Parent.Title +
                `>
                  <a class="nav-link" href="/sites/PMO/SitePages/`+ listItemsSubMenu[i].navigationLinks +`">` + listItemsSubMenu[i].iconsHTML +`<span>` + 
                listItemsSubMenu[i].SubMenu +
                `</span></a>
                </li>
                `
            );
            $("." + currentMenu).show();
            $("#subMenu").show();
          }
        }
      } //getSubMenuItems fundtion end

      function showSubMenu_onhover(innerNavitem) {
        $("#subMenu").on({
          // mouseenter: function(){
          //   $("." + innerNavitem.innerText).show();
          //   $(this).show();
          // },
          mouseleave: function () {
            $("." + innerNavitem.innerText).hide();
            $(this).hide();
            if ($("#UL_mainMenu li").hasClass("active")) {
              $("#UL_mainMenu li").removeClass("active"); //removing all previous active class when changing menu item
            }
          },
        });
      }
    }); // document.ready function end
  } //renderPlaceholder function end

  public async getlistItems(url: string): Promise<ISPList[]> {
    let currentURL = await this.context.pageContext.web.absoluteUrl;

    let requestURL = currentURL.concat(url);
    return this.context.spHttpClient
      .get(requestURL, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json();
      })
      .then((jsonresponse) => {
        return jsonresponse.value;
        console.log(jsonresponse.value);
      }) as Promise<ISPList[]>;
  } //get list item function end
}
