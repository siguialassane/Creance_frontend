"use client"

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const labelColor = '#374151';
const titleColor = '#1a202c';

type Props = {
  control: Control<any>;
  errors: FieldErrors<any>;
  readOnly?: boolean;
};

export function DebiteurFormStep2Moral({ control, errors, readOnly = false }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-4" style={{ color: titleColor }}>
        Personne morale
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="registreCommerce" className="text-sm font-medium whitespace-nowrap flex-shrink-0" style={{ color: labelColor, minWidth: '160px' }}>
              Registre de commerce <span className="text-red-500">*</span>
            </Label>
            <Controller
            name="registreCommerce"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Ex: CI-ABJ-2024-A-12345"
                maxLength={15}
                disabled={readOnly}
                className={`${errors.registreCommerce ? 'border-red-500 bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
              />
            )}
          />
          </div>
          {errors.registreCommerce && <p className="text-sm text-red-500">{String(errors.registreCommerce.message)}</p>}
          <p className="text-xs text-gray-500 mt-1">
            Maximum 15 caractères
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="raisonSociale" className="text-sm font-medium" style={{ color: labelColor }}>
            Raison sociale <span className="text-red-500">*</span>
          </Label>
            <Controller
            name="raisonSociale"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Ex: Société ABC SARL"
                disabled={readOnly}
                className={`${errors.raisonSociale ? 'border-red-500 bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
              />
            )}
          />
          </div>
          {errors.raisonSociale && <p className="text-sm text-red-500">{String(errors.raisonSociale.message)}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="capitalSocial" className="text-sm font-medium" style={{ color: labelColor }}>
            Capital social
          </Label>
            <Controller
            name="capitalSocial"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Ex: 10 000 000"
                disabled={readOnly}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, '');
                  const formatted = numbers ? numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '';
                  field.onChange(formatted);
                }}
                className={`${readOnly ? 'bg-gray-50' : ''} flex-1`}
              />
            )}
          />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="formeJuridique" className="text-sm font-medium" style={{ color: labelColor }}>
            Forme juridique <span className="text-red-500">*</span>
          </Label>
            <Controller
            name="formeJuridique"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""} disabled={readOnly}>
                <SelectTrigger className={`${errors.formeJuridique ? 'border-red-500' : ''} flex-1`}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SARL">SARL</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="SNC">SNC</SelectItem>
                  <SelectItem value="EURL">EURL</SelectItem>
                  <SelectItem value="SAS">SAS</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          </div>
          {errors.formeJuridique && <p className="text-sm text-red-500">{String(errors.formeJuridique.message)}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="domaineActivite" className="text-sm font-medium" style={{ color: labelColor }}>
            Domaine d'activité <span className="text-red-500">*</span>
          </Label>
            <Controller
            name="domaineActivite"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""} disabled={readOnly}>
                <SelectTrigger className={`${errors.domaineActivite ? 'border-red-500' : ''} flex-1`}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commerce">Commerce</SelectItem>
                  <SelectItem value="industrie">Industrie</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="batiment">Bâtiment</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          </div>
          {errors.domaineActivite && <p className="text-sm text-red-500">{String(errors.domaineActivite.message)}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="nomGerant" className="text-sm font-medium" style={{ color: labelColor }}>
            Nom du gérant <span className="text-red-500">*</span>
          </Label>
            <Controller
            name="nomGerant"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Ex: Koné Amadou"
                disabled={readOnly}
                className={`${errors.nomGerant ? 'border-red-500 bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
              />
            )}
          />
          </div>
          {errors.nomGerant && <p className="text-sm text-red-500">{String(errors.nomGerant.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
              <Label htmlFor="siegeSocial" className="text-sm font-medium" style={{ color: labelColor }}>
            Siège social <span className="text-red-500">*</span>
          </Label>
            <Controller
            name="siegeSocial"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ""}
                placeholder="Ex: Cocody, Angré 8ème Tranche, Abidjan"
                disabled={readOnly}
                className={`${errors.siegeSocial ? 'border-red-500 bg-red-50' : readOnly ? 'bg-gray-50' : ''} flex-1`}
              />
            )}
          />
          </div>
          {errors.siegeSocial && <p className="text-sm text-red-500">{String(errors.siegeSocial.message)}</p>}
        </div>
      </div>
    </div>
  );
}
