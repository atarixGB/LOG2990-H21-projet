import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FIRSTCOLORTEST, SECONDCOLORTEST } from '@app/constants';
import { ColorOrder } from 'src/app/interfaces-enums/color-order';
import { RGBA } from 'src/app/interfaces-enums/rgba';
import { ColorManagerService } from 'src/app/services/color-manager/color-manager.service';
import { ColorSliderComponent } from './color-slider.component';
fdescribe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorManagerSpy: jasmine.SpyObj<ColorManagerService>;
    // let contextStub: CanvasRenderingContext2D;
    beforeEach(() => {
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['getColorStringAlpha', 'updatePixelColor']);
        colorManagerSpy.getColorStringAlpha.and.returnValue('rgba(255,255,255,1)');
        // contextStub = new CanvasTestHelper().canvas.getContext('2d') as CanvasRenderingContext2D;
        colorManagerSpy = jasmine.createSpyObj('ColorManagerService', ['updatePixelColor']);
        colorManagerSpy.selectedColor = new Array<RGBA>();
        colorManagerSpy.selectedColor[ColorOrder.primaryColor] = FIRSTCOLORTEST;
        colorManagerSpy.selectedColor[ColorOrder.secondaryColor] = SECONDCOLORTEST;
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [ColorSliderComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: ColorManagerService, useValue: colorManagerSpy },
            ],
        }).compileComponents();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should update gradient with color picked', () => {
        component.upgradeColorCoord({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalledTimes(1);
    });
    it('should not update gradient with color picked', () => {
        component.upgradeColorCoord({ x: 1, y: 1 });
        expect(colorManagerSpy.updatePixelColor).toHaveBeenCalled();
    });

    it('should update color if user clic on gradient', () => {
        component.colorOrder = ColorOrder.primaryColor;
        spyOn(component.shouldUpdateGradient, 'emit').and.callThrough();
        const mockMouse = new MouseEvent('mousedown');

        component.mouseDownFromGradient(mockMouse);
        fixture.detectChanges();
        expect(component.shouldUpdateGradient.emit).toHaveBeenCalled();
    });
});
