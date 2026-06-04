/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal, { type SweetAlertOptions, type SweetAlertResult } from 'sweetalert2'

import { $i18n } from '@/plugins/i18n'

type AlertOptions = SweetAlertOptions & {
	isHtml?: boolean
	text?: string
	title?: string
	unclosable?: boolean
}

type ToastOptions = SweetAlertOptions & {
	timer?: number
	position?: 'top-end' | 'top' | 'bottom' | 'bottom-end'
}

type SwalOptions = AlertOptions | ToastOptions

const showAlert = (message: string, options: AlertOptions = {}) => {
	if (options.isHtml) {
		options.html = message
		delete options.isHtml
	} else {
		options.text = message
	}

	if (options.unclosable) {
		options.allowEscapeKey = false
		options.allowOutsideClick = false
		options.showCancelButton = false
		options.showCloseButton = false
		options.showConfirmButton = false
		options.showDenyButton = false
		delete options.unclosable
	}

	return Swal.fire({ ...options })
}
const showToast = (message: string, options: ToastOptions = {}) => {
	return showAlert(message, {
		position: 'top-end',
		timer: 4000,
		...options,
		showConfirmButton: false,
		title: undefined,
		toast: true,
	})
}

const successOptions = (options: SwalOptions = {}): SwalOptions => ({
	title: $i18n.t('Succès') as string,
	...options,
	icon: 'success',
})
const errorOptions = (options: SwalOptions = {}): SwalOptions => ({
	title: $i18n.t('Erreur') as string,
	...options,
	icon: 'error',
})
const infoOptions = (options: SwalOptions = {}): SwalOptions => ({
	title: $i18n.t('Info') as string,
	...options,
	icon: 'info',
})
const warningOptions = (options: SwalOptions = {}): SwalOptions => ({
	title: $i18n.t('Avertissement') as string,
	...options,
	icon: 'warning',
})

const alertSuccess = (message: string, options: AlertOptions = {}) => showAlert(message, successOptions(options) as AlertOptions)
const alertError = (message: string, options: AlertOptions = {}) => showAlert(message, errorOptions(options) as AlertOptions)
const alertInfo = (message: string, options: AlertOptions = {}) => showAlert(message, infoOptions(options) as AlertOptions)
const alertWarning = (message: string, options: AlertOptions = {}) => showAlert(message, warningOptions(options) as AlertOptions)

const toastSuccess = (message: string, options: ToastOptions = {}) => showToast(message, successOptions(options) as ToastOptions)
const toastError = (message: string, options: ToastOptions = {}) => showToast(message, errorOptions(options) as ToastOptions)
const toastInfo = (message: string, options: ToastOptions = {}) => showToast(message, infoOptions(options) as ToastOptions)
const toastWarning = (message: string, options: ToastOptions = {}) => showToast(message, warningOptions(options) as ToastOptions)

const confirm = async (message: string | null = null, options: AlertOptions = {}) => {
	return new Promise((resolve) => {
		showAlert(message || 'Êtes-vous sûr de vouloir continuer ?', {
			allowOutsideClick: () => !Swal.isLoading(),
			buttonsStyling: true,
			cancelButtonText: $i18n.t('Non') as string,
			confirmButtonText: $i18n.t('Oui') as string,
			customClass: {
				cancelButton: 'btn btn-danger',
				confirmButton: 'btn btn-primary',
			},
			icon: 'warning',
			reverseButtons: true,
			showCancelButton: true,
			showLoaderOnConfirm: true,
			title: 'Confirmation',
			...options,
		}).then((result) => {
			resolve(result.isConfirmed)
		})
	})
}

const confirmDeletion = async (mesage: string, preConfirm?: (inputValue: any) => any) => {
	return confirm(mesage, {
		confirmButtonText: 'Oui, supprimer',
		preConfirm,
	})
}

interface AlertMethods {
	error: (message: string, options?: AlertOptions) => Promise<SweetAlertResult>
	info: (message: string, options?: AlertOptions) => Promise<SweetAlertResult>
	success: (message: string, options?: AlertOptions) => Promise<SweetAlertResult>
	waring: (message: string, options?: AlertOptions) => Promise<SweetAlertResult>
}

interface ToastMethods {
	error: (message: string, options?: ToastOptions) => Promise<SweetAlertResult>
	info: (message: string, options?: ToastOptions) => Promise<SweetAlertResult>
	success: (message: string, options?: ToastOptions) => Promise<SweetAlertResult>
	warning: (message: string, options?: ToastOptions) => Promise<SweetAlertResult>
}

export const $alert: AlertMethods = {
	error: alertError,
	info: alertInfo,
	success: alertSuccess,
	waring: alertWarning,
}
export const $toast: ToastMethods = {
	error: toastError,
	info: toastInfo,
	success: toastSuccess,
	warning: toastWarning,
}
export const $confirm = confirm
export const $confirmDeletion = confirmDeletion

export const useAlert = (): AlertMethods & { confirm: typeof confirm } => ({
	...$alert,
	confirm,
})

export const useToast = (): ToastMethods => ({
	...$toast,
})
