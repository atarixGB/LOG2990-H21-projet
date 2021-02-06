import { Component } from '@angular/core';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorOrder } from './../../../../interfaces-enums/color-order';
import { ColorManagerService } from './../../../../services/color-manager/color-manager.service';

@Component({
    selector: 'app-color-displayer',
    templateUrl: './color-displayer.component.html',
    styleUrls: ['./color-displayer.component.scss'],
})
export class ColorDisplayerComponent {
    primaryColor: RGBA;
    secondaryColor: RGBA;
    ColorOrder: ColorOrder;

    constructor(private colorManager: ColorManagerService) {
        this.primaryColor = this.colorManager.selectedColors[ColorOrder.primaryColor];
        this.secondaryColor = this.colorManager.selectedColors[ColorOrder.secondaryColor];
    }

    exchangeColorOrder(): void {
        const primary = this.colorManager.selectedColors[ColorOrder.primaryColor];
        const secondary = this.colorManager.selectedColors[ColorOrder.secondaryColor];

        const tempForSwitch = JSON.parse(JSON.stringify(primary));

        primary.Dec = secondary.Dec;
        primary.Hex = secondary.Hex;
        primary.inString = secondary.inString;

        secondary.Dec = tempForSwitch.Dec;
        secondary.Hex = tempForSwitch.Hex;
        secondary.inString = tempForSwitch.inString;
    }
}
