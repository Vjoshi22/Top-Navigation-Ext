//import styles from '../Components/Style/SPExt'
import { SPComponentLoader } from "@microsoft/sp-loader";
import { listItems, ISPList } from '../SpExtApplicationCustomizer';

SPComponentLoader.loadCss(
  "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
);
SPComponentLoader.loadScript(
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"
);

var test = listItems[0].Parent.Title;
export class GlobalNav {
  public static globalNavHTMLTemplate: string = `
  <div id="mainMenu">
  <nav id="topNavBar" class="navbar navbar-expand-sm">
<!-- Brand -->
<a class="navbar-brand" href="#">PMO Site</a>
<!-- Links -->
<ul class="navbar-nav" id="UL_mainMenu">
</ul>
</nav>
</div>
    
    `;
}
